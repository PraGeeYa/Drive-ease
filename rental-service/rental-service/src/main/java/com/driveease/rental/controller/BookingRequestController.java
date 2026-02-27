package com.driveease.rental.controller;

import com.driveease.rental.model.BookingRequest;
import com.driveease.rental.repository.BookingRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

/**
 * BookingRequestController manages the initial stage of a booking inquiry.
 * It allows customers to submit requests and agents to view their assigned inquiries.
 */
@RestController
@RequestMapping("/api/booking-requests")
// @CrossOrigin(origins = "http://localhost:3000") // CORS enabling for Frontend connection
public class BookingRequestController {

    @Autowired
    private BookingRequestRepository repository;

    /**
     * Handles the submission of a new booking inquiry by a customer.
     * Sets the default status to 'PENDING' and records the current timestamp.
     * * @param request The booking request data from the frontend
     * @return The saved BookingRequest entity with timestamp and pending status
     */
    @PostMapping("/send")
    public BookingRequest sendRequest(@RequestBody BookingRequest request) {
        // Initializing the inquiry state as 'PENDING' for Agent review
        request.setStatus("PENDING");
        // Recording the exact date and time the request was created
        request.setRequestDate(LocalDateTime.now());
        // Persisting the inquiry to the database
        return repository.save(request);
    }

    /**
     * Retrieves a list of inquiries assigned to a specific support agent.
     * This allows agents to see their personalized queue of incoming requests.
     * * @param agentId The unique ID of the agent
     * @return List of booking requests assigned to the agent
     */
    @GetMapping("/agent/{agentId}")
    public List<BookingRequest> getAgentRequests(@PathVariable Long agentId) {
        // Utilizes the repository method to filter records by the assigned Agent's User ID
        return repository.findByAgentUserId(agentId);
    }
}