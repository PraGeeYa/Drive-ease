package com.driveease.rental.controller;

import com.driveease.rental.model.*;
import com.driveease.rental.repository.*;
import com.driveease.rental.service.BookingService;
import com.driveease.rental.service.EmailService; // Import the new EmailService
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

/**
 * BookingController manages the entire lifecycle of a car rental booking.
 * Now integrated with EmailService for professional HTML notifications.
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
    private EmailService emailService; // Using the professional EmailService

    // ========================================================================
    // BOOKING RETRIEVAL SECTION
    // ========================================================================

    @GetMapping("/agent/{agentId}")
    public List<Booking> getBookingsByAgent(@PathVariable Long agentId) {
        return bookingRepository.findByAgentUserId(agentId);
    }

    @GetMapping("/all")
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    // ========================================================================
    // SEARCH & AVAILABILITY SECTION
    // ========================================================================

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
    // BOOKING EXECUTION & CONFIRMATION SECTION
    // ========================================================================

    /**
     * Approves a pending request and triggers a rich HTML email via EmailService.
     */
    @PostMapping("/confirm")
    public ResponseEntity<?> confirmBooking(@RequestBody Map<String, Object> data) {
        try {
            Booking booking = new Booking();
            booking.setRentalDays(Integer.parseInt(data.get("rentalDays").toString()));
            booking.setVehicleCount(Integer.parseInt(data.get("vehicleCount").toString()));
            booking.setFinalPrice(new BigDecimal(data.get("finalPrice").toString()));
            booking.setPickupDate(LocalDate.now());

            User customer = userRepository.findById(Long.valueOf(data.get("customerId").toString())).orElseThrow();
            User agent = userRepository.findById(Long.valueOf(data.get("agentId").toString())).orElseThrow();
            VehicleContract contract = contractRepository.findById(Long.valueOf(data.get("contractId").toString())).orElseThrow();

            booking.setCustomer(customer);
            booking.setAgent(agent);
            booking.setVehicleContract(contract);

            bookingRepository.save(booking);

            BookingRequest req = bookingRequestRepository.findById(Long.valueOf(data.get("requestId").toString())).orElseThrow();
            req.setStatus("APPROVED");
            bookingRequestRepository.save(req);

            // UPDATED: Trigger HTML Email Notification using the template
            if (customer.getEmail() != null && !customer.getEmail().isEmpty()) {
                emailService.sendBookingConfirmation(
                        customer.getEmail(),
                        customer.getUsername(), // Passing customer name
                        req.getVehicleType(),   // Passing vehicle model
                        LocalDate.now().toString(), // Pickup date
                        req.getFinalPrice().toString() // Price
                );
            }

            return ResponseEntity.ok("Booking confirmed and HTML Email sent successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/create")
    public ResponseEntity<?> createBooking(@RequestBody Map<String, Object> data) {
        try {
            Booking booking = new Booking();
            booking.setRentalDays(Integer.parseInt(data.get("rentalDays").toString()));
            booking.setVehicleCount(Integer.parseInt(data.get("vehicleCount").toString()));
            booking.setFinalPrice(new BigDecimal(data.get("finalPrice").toString()));
            booking.setPickupDate(LocalDate.parse(data.get("pickupDate").toString()));
            booking.setCustomerName(data.get("customerName").toString());
            booking.setRequirements(data.get("requirements").toString());

            User agent = userRepository.findById(Long.valueOf(data.get("agentId").toString())).orElseThrow();
            VehicleContract contract = contractRepository.findById(Long.valueOf(data.get("contractId").toString())).orElseThrow();

            booking.setAgent(agent);
            booking.setVehicleContract(contract);

            bookingRepository.save(booking);
            return ResponseEntity.ok("Booking created successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    // ========================================================================
    // REQUEST MANAGEMENT SECTION
    // ========================================================================

    @GetMapping("/requests/agent/{agentId}")
    public List<BookingRequest> getAgentRequests(@PathVariable Long agentId) {
        return bookingRequestRepository.findByAgentUserId(agentId);
    }

    @GetMapping("/requests/customer/{customerId}")
    public List<BookingRequest> getCustomerRequests(@PathVariable Long customerId) {
        return bookingRequestRepository.findByCustomerUserId(customerId);
    }

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
            return ResponseEntity.ok("Request sent successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    // ========================================================================
    // MAINTENANCE SECTION
    // ========================================================================

    @PutMapping("/{id}")
    public ResponseEntity<?> updateBooking(@PathVariable Long id, @RequestBody Map<String, Object> data) {
        try {
            Booking booking = bookingRepository.findById(id).orElseThrow();
            if (data.containsKey("customerName")) booking.setCustomerName(data.get("customerName").toString());
            if (data.containsKey("pickupDate")) booking.setPickupDate(LocalDate.parse(data.get("pickupDate").toString()));
            bookingRepository.save(booking);
            return ResponseEntity.ok("Booking record updated successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(404).body("Booking not found: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBooking(@PathVariable Long id) {
        try {
            if (!bookingRepository.existsById(id)) return ResponseEntity.status(404).body("Record not found.");
            bookingRepository.deleteById(id);
            return ResponseEntity.ok("Booking record deleted permanently!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
}