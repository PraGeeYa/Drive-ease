package com.driveease.rental.controller;

import com.driveease.rental.model.*;
import com.driveease.rental.repository.*;
import com.driveease.rental.service.BookingService;
import com.driveease.rental.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

/**
 * BookingController - Orchestrates the entire rental lifecycle.
 * Developed by: Prageeth Weerasekara
 * * This controller handles vehicle searching, booking inquiries,
 * approval workflows, and automated customer notifications.
 */
@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VehicleContractRepository contractRepository;

    @Autowired
    private BookingRequestRepository bookingRequestRepository;

    @Autowired
    private EmailService emailService;

    // ========================================================================
    // SECTION: DATA RETRIEVAL (AGENT & ADMIN VIEWS)
    // ========================================================================

    /**
     * Retrieves all confirmed bookings assigned to a specific support agent.
     * @param agentId The unique ID of the Support Agent.
     */
    @GetMapping("/agent/{agentId}")
    public List<Booking> getBookingsByAgent(@PathVariable Long agentId) {
        return bookingRepository.findByAgentUserId(agentId);
    }

    /**
     * Admin view to fetch every booking record existing in the system.
     */
    @GetMapping("/all")
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    // ========================================================================
    // SECTION: SEARCH & DYNAMIC PRICING
    // ========================================================================

    /**
     * SEARCH ENGINE: Filters available vehicles and calculates estimated costs.
     * @param type - Category of vehicle (SUV, Sedan, etc.)
     * @param days - Number of rental days
     * @param count - Number of vehicles requested
     */
    @GetMapping("/search")
    public List<Map<String, Object>> searchVehicles(
            @RequestParam(required = false, defaultValue = "") String type,
            @RequestParam(required = false, defaultValue = "1") int days,
            @RequestParam(required = false, defaultValue = "1") int count) {

        List<VehicleContract> contracts = bookingService.searchAvailableVehicles(type);
        List<Map<String, Object>> resultList = new ArrayList<>();

        for (VehicleContract contract : contracts) {
            Map<String, Object> response = new HashMap<>();
            response.put("contractId", contract.getContractId());
            response.put("vehicleType", contract.getVehicleType());
            response.put("providerName", contract.getProvider() != null ? contract.getProvider().getProviderName() : "DriveEase Elite");

            // Calculate price based on business logic markup (e.g., 10% fee)
            BigDecimal totalPrice = bookingService.calculateFinalPrice(contract.getBaseRatePerDay(), days, count);

            response.put("finalPrice", totalPrice);
            response.put("baseRate", contract.getBaseRatePerDay());
            response.put("availability", contract.isAvailabilityStatus() ? "Available" : "Not Available");
            response.put("imageUrl", "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600");

            resultList.add(response);
        }
        return resultList;
    }

    // ========================================================================
    // SECTION: TRANSACTION EXECUTION & EMAIL NOTIFICATION
    // ========================================================================

    /**
     * CONFIRM BOOKING: Converts a 'Pending Request' into a 'Confirmed Booking'.
     * This method also triggers an automated HTML confirmation email to the client.
     */
    @PostMapping("/confirm")
    public ResponseEntity<?> confirmBooking(@RequestBody Map<String, Object> data) {
        try {
            // 1. Initialize and Map Booking Entity
            Booking booking = new Booking();
            booking.setRentalDays(Integer.parseInt(data.get("rentalDays").toString()));
            booking.setVehicleCount(Integer.parseInt(data.get("vehicleCount").toString()));
            booking.setFinalPrice(new BigDecimal(data.get("finalPrice").toString()));
            booking.setPickupDate(LocalDate.now());

            // 2. Fetch Relationships from database
            User customer = userRepository.findById(Long.valueOf(data.get("customerId").toString())).orElseThrow();
            User agent = userRepository.findById(Long.valueOf(data.get("agentId").toString())).orElseThrow();
            VehicleContract contract = contractRepository.findById(Long.valueOf(data.get("contractId").toString())).orElseThrow();

            booking.setCustomer(customer);
            booking.setAgent(agent);
            booking.setVehicleContract(contract);

            // 3. Persist Confirmed Booking
            bookingRepository.save(booking);

            // 4. Transition the original request status from 'PENDING' to 'APPROVED'
            BookingRequest req = bookingRequestRepository.findById(Long.valueOf(data.get("requestId").toString())).orElseThrow();
            req.setStatus("APPROVED");
            bookingRequestRepository.save(req);

            /**
             * EMAIL DISPATCH ENGINE:
             * Priority: 1. User Profile Email | 2. Manual Frontend Entry
             */
            String recipientEmail = (customer.getEmail() != null) ? customer.getEmail() : data.get("customerEmail").toString();

            if (recipientEmail != null && !recipientEmail.isEmpty()) {
                emailService.sendBookingConfirmation(
                        recipientEmail,
                        customer.getUsername(),
                        req.getVehicleType(),
                        LocalDate.now().toString(),
                        req.getFinalPrice().toString()
                );
                return ResponseEntity.ok("Booking confirmed and HTML Email dispatched to: " + recipientEmail);
            }

            return ResponseEntity.ok("Booking saved successfully, but email dispatch was skipped.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Transaction Error: " + e.getMessage());
        }
    }

    /**
     * FIXED MANUAL CREATE:
     * Allows Agents to register bookings directly to the Confirmed Contracts (Booking History) table.
     */
    @PostMapping("/create")
    public ResponseEntity<?> createBooking(@RequestBody Map<String, Object> data) {
        try {
            Booking booking = new Booking();

            // 1. Set simple fields mapping correctly from Frontend Payload
            booking.setRentalDays(Integer.parseInt(data.get("rentalDays").toString()));
            booking.setVehicleCount(Integer.parseInt(data.get("vehicleCount").toString()));
            booking.setFinalPrice(new BigDecimal(data.get("finalPrice").toString()));
            booking.setPickupDate(LocalDate.parse(data.get("pickupDate").toString()));
            booking.setCustomerName(data.get("customerName").toString());

            // 2. Fetch Relationships (Agent and Vehicle)
            User agent = userRepository.findById(Long.valueOf(data.get("agentId").toString()))
                    .orElseThrow(() -> new RuntimeException("Agent not found"));

            // Note: Frontend sends 'vehicleId', so we extract it using that key.
            VehicleContract contract = contractRepository.findById(Long.valueOf(data.get("vehicleId").toString()))
                    .orElseThrow(() -> new RuntimeException("Vehicle not found"));

            // 3. Set Customer (Optional for direct agent bookings, but required if foreign key is NOT NULL in DB)
            if (data.get("customerId") != null) {
                User customer = userRepository.findById(Long.valueOf(data.get("customerId").toString())).orElse(null);
                booking.setCustomer(customer);
            }

            booking.setAgent(agent);
            booking.setVehicleContract(contract);

            // Save directly to the main Booking table (Booking History)
            bookingRepository.save(booking);

            return ResponseEntity.ok("Direct booking saved to Confirmed Contracts successfully!");
        } catch (Exception e) {
            e.printStackTrace(); // This prints the exact error in your Spring Boot console
            return ResponseEntity.status(500).body("Error creating booking: " + e.getMessage());
        }
    }

    // ========================================================================
    // SECTION: REQUEST WORKFLOW
    // ========================================================================

    /**
     * Fetches all incoming rental inquiries for a specific Agent.
     */
    @GetMapping("/requests/agent/{agentId}")
    public List<BookingRequest> getAgentRequests(@PathVariable Long agentId) {
        return bookingRequestRepository.findByAgentUserId(agentId);
    }

    /**
     * API to process initial vehicle inquiries from the Customer Search Portal.
     */
    @PostMapping("/request")
    public ResponseEntity<?> createBookingRequest(@RequestBody Map<String, Object> data) {
        try {
            BookingRequest request = new BookingRequest();
            request.setCustomer(userRepository.findById(Long.valueOf(data.get("customerId").toString())).orElseThrow());
            request.setAgent(userRepository.findById(Long.valueOf(data.get("agentId").toString())).orElseThrow());
            request.setVehicleContract(contractRepository.findById(Long.valueOf(data.get("contractId").toString())).orElseThrow());
            request.setVehicleType(data.get("vehicleType").toString());
            request.setFinalPrice(new BigDecimal(data.get("finalPrice").toString()));
            request.setStatus("PENDING");
            request.setRequestDate(LocalDateTime.now());
            bookingRequestRepository.save(request);
            return ResponseEntity.ok("Rental inquiry successfully transmitted to the agent.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
    /**
     * UPDATED: Added PUT method to support Booking updates.
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateBooking(@PathVariable Long id, @RequestBody Map<String, Object> data) {
        try {
            Booking booking = bookingRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + id));

            // Update fields based on input
            if (data.containsKey("customerName")) {
                booking.setCustomerName(data.get("customerName").toString());
            }
            if (data.containsKey("pickupDate")) {
                booking.setPickupDate(LocalDate.parse(data.get("pickupDate").toString()));
            }

            bookingRepository.save(booking);
            return ResponseEntity.ok("Booking # " + id + " updated successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Update failed: " + e.getMessage());
        }
    }

    // ========================================================================
    // SECTION: CLEANUP & AUDIT
    // ========================================================================

    /**
     * Permanently removes a booking record from the central ledger.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBooking(@PathVariable Long id) {
        bookingRepository.deleteById(id);
        return ResponseEntity.ok("Booking record purged successfully.");
    }
}