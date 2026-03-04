package com.driveease.rental.controller;

import com.driveease.rental.model.BookingRequest;
import com.driveease.rental.repository.BookingRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

/**
 * BookingRequestController - Manages the lifecycle of initial vehicle inquiries.
 * Acts as the bridge between a customer's intent to rent and an agent's approval queue.
 */
@RestController
@RequestMapping("/api/booking-requests")
@CrossOrigin(origins = "http://localhost:3000") // Enabling CORS for frontend integration
public class BookingRequestController {

    @Autowired
    private BookingRequestRepository repository;

    /**
     * SUBMIT INQUIRY
     * Receives a vehicle request from the customer.
     * Automatically tags the request as 'PENDING' and stamps the current time.
     * @param request - Data containing customer, agent, and vehicle contract details.
     * @return The finalized request stored in the database.
     */
    @PostMapping("/send")
    public BookingRequest sendRequest(@RequestBody BookingRequest request) {
        // Sets the default state so the assigned Agent knows it requires action
        request.setStatus("PENDING");

        // Logs the exact moment the request entered the system
        request.setRequestDate(LocalDateTime.now());

        // Saves the entry to the 'booking_request' table
        return repository.save(request);
    }

    /**
     * FETCH AGENT QUEUE
     * Retrieves all inquiries assigned to a specific Support Agent.
     * Used by agents to manage their daily workflow and approve/reject deals.
     * @param agentId - The unique ID of the agent logged into the system.
     * @return A list of requests specifically for the requested agent.
     */
    @GetMapping("/agent/{agentId}")
    public List<BookingRequest> getAgentRequests(@PathVariable Long agentId) {
        // Filters the database to show only requests belonging to this agent
        return repository.findByAgentUserId(agentId);
    }
}