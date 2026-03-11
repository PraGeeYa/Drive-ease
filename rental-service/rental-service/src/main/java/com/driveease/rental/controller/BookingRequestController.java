package com.driveease.rental.controller;

import com.driveease.rental.model.BookingRequest;
import com.driveease.rental.model.User;
import com.driveease.rental.model.VehicleContract;
import com.driveease.rental.repository.BookingRequestRepository;
import com.driveease.rental.repository.UserRepository;
import com.driveease.rental.repository.VehicleContractRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/**
 * BookingRequestController - Manages the lifecycle of a vehicle rental request.
 * From submission by a customer to approval by an agent.
 */
@RestController
@RequestMapping("/api/booking-requests")
public class BookingRequestController {

    @Autowired
    private BookingRequestRepository repository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VehicleContractRepository vehicleRepository;

    /**
     * POST: SUBMIT REQUEST
     * Creates a new booking entry by linking the Customer, Agent, and Vehicle.
     */
    @PostMapping("/submit")
    public ResponseEntity<?> submitRequest(@RequestBody Map<String, Object> payload) {
        try {
            BookingRequest request = new BookingRequest();

            // Link the Customer from Database
            if (payload.get("customerId") != null) {
                Long customerId = Long.valueOf(payload.get("customerId").toString());
                User customer = userRepository.findById(customerId).orElse(null);
                request.setCustomer(customer);
            }

            // Link the Assigned Agent from Database
            if (payload.get("agentId") != null) {
                Long agentId = Long.valueOf(payload.get("agentId").toString());
                User agent = userRepository.findById(agentId).orElse(null);
                request.setAgent(agent);
            }

            // Link the Selected Vehicle/Contract from Database
            if (payload.get("vehicleId") != null) {
                Long vehicleId = Long.valueOf(payload.get("vehicleId").toString());
                VehicleContract vehicle = vehicleRepository.findById(vehicleId).orElse(null);
                request.setVehicleContract(vehicle);
            }

            request.setCustomerEmail((String) payload.get("customerEmail"));
            request.setVehicleType((String) payload.get("vehicleType"));

            // Convert string total amount to BigDecimal for financial accuracy
            if (payload.get("totalAmount") != null) {
                request.setFinalPrice(new BigDecimal(payload.get("totalAmount").toString()));
            }

            // Logic: If status is not provided, default to PENDING.
            // Agents can provide a status directly (e.g., 'CONFIRMED').
            if (payload.get("status") != null) {
                request.setStatus((String) payload.get("status"));
            } else {
                request.setStatus("PENDING");
            }

            request.setRequestDate(LocalDateTime.now());

            BookingRequest saved = repository.save(request);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            // Returns 500 status if a database or parsing error occurs
            return ResponseEntity.internalServerError().body("DB Error: " + e.getMessage());
        }
    }

    /**
     * PATCH: APPROVE REQUEST
     * Updates the status of an existing request to 'APPROVED'.
     */
    @PatchMapping("/{requestId}/approve")
    public ResponseEntity<?> approveRequest(@PathVariable Long requestId) {
        try {
            BookingRequest request = repository.findById(requestId)
                    .orElseThrow(() -> new RuntimeException("Request not found"));

            request.setStatus("APPROVED");
            repository.save(request);

            return ResponseEntity.ok("Request Approved Successfully!");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    /**
     * GET: AGENT REQUESTS
     * Fetches all bookings assigned to a specific Agent.
     */
    @GetMapping("/agent/{agentId}")
    public List<BookingRequest> getAgentRequests(@PathVariable Long agentId) {
        return repository.findByAgentUserId(agentId);
    }

    /**
     * GET: CUSTOMER REQUESTS
     * Fetches the booking history for a specific Customer.
     */
    @GetMapping("/customer/{customerId}")
    public List<BookingRequest> getCustomerRequests(@PathVariable Long customerId) {
        return repository.findByCustomerUserId(customerId);
    }
}