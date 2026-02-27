package com.driveease.rental.repository;

import com.driveease.rental.model.BookingRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

/**
 * BookingRequestRepository serves as the data access layer for booking inquiries.
 * It provides methods to filter pending requests for both Agents and Customers.
 */
public interface BookingRequestRepository extends JpaRepository<BookingRequest, Long> {

    /**
     * Retrieves all booking requests assigned to a specific Support Agent.
     * This is used by the Agent Dashboard to display their personalized task queue.
     * * @param agentId The unique ID of the Support Agent.
     * @return A list of inquiries assigned to that specific agent.
     */
    List<BookingRequest> findByAgentUserId(Long agentId);

    /**
     * Filters and retrieves all booking requests submitted by a specific Customer.
     * This allows customers to track the status (PENDING/APPROVED) of their inquiries.
     * * @param customerId The unique ID of the Customer.
     * @return A list of requests made by the customer.
     */
    List<BookingRequest> findByCustomerUserId(Long customerId);
}