package com.driveease.rental.repository;

import com.driveease.rental.model.Booking;
import com.driveease.rental.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.List;

/**
 * BookingRepository - Data Access Layer for the Booking Entity.
 * This interface bridges the gap between Java logic and the MySQL 'booking' table,
 * providing both standard CRUD operations and custom business analytics.
 */
@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    /**
     * Finds all bookings handled by a specific Agent object.
     * @param agent - The User object representing the agent.
     */
    List<Booking> findByAgent(User agent);

    /**
     * Finds all bookings made by a specific Customer object.
     * @param customer - The User object representing the customer.
     */
    List<Booking> findByCustomer(User customer);

    /**
     * ID-BASED FILTER: Fetches all confirmed bookings assigned to an agent by their User ID.
     * Extremely useful for the Agent Dashboard to list only their relevant transactions.
     * @param agentId - The unique Primary Key of the agent user.
     */
    List<Booking> findByAgentUserId(Long agentId);

    // ========================================================================
    // ANALYTICS & REPORTING SECTION (Admin Intel)
    // ========================================================================

    /**
     * REVENUE ANALYTICS
     * Uses JPQL (Java Persistence Query Language) to aggregate the total system income.
     * It adds up the 'finalPrice' of every rental transaction in the system.
     * @return Sum of all sales as a high-precision BigDecimal.
     */
    @Query("SELECT SUM(b.finalPrice) FROM Booking b")
    BigDecimal getTotalRevenue();

    /**
     * TRANSACTION VOLUME
     * Returns the grand total of confirmed bookings stored in the database.
     * Helps Admin track the overall activity level of the system.
     */
    @Query("SELECT COUNT(b) FROM Booking b")
    Long getTotalBookingCount();
}