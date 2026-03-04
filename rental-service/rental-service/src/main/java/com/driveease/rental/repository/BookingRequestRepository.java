package com.driveease.rental.repository;

import com.driveease.rental.model.BookingRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

/**
 * BookingRequestRepository - Data Access Layer for initial vehicle inquiries.
 * This interface bridges the gap between the application logic and the
 * 'booking_request' database table.
 */
public interface BookingRequestRepository extends JpaRepository<BookingRequest, Long> {

    /**
     * FETCH AGENT QUEUE:
     * Retrieves all incoming inquiries specifically assigned to a Support Agent.
     * This method is the backbone of the Agent Dashboard's "Pending Requests" view.
     * * @param agentId - The unique Primary Key of the Support Agent.
     * @return A list of pending or processed inquiries for that agent.
     */
    List<BookingRequest> findByAgentUserId(Long agentId);

    /**
     * FETCH CUSTOMER HISTORY:
     * Retrieves all requests submitted by a particular user/client.
     * This allows the customer to monitor if their request is PENDING, APPROVED, or REJECTED.
     * * @param customerId - The unique Primary Key of the Customer.
     * @return A list of inquiries initiated by this customer.
     */
    List<BookingRequest> findByCustomerUserId(Long customerId);
}