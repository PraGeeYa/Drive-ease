package com.driveease.rental.repository;

import com.driveease.rental.model.VehicleContract;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * VehicleContractRepository manages data access for the vehicle inventory.
 * It provides advanced filtering for availability and agent-specific stock,
 * alongside custom reporting queries for the Admin Dashboard.
 */
@Repository
public interface VehicleContractRepository extends JpaRepository<VehicleContract, Long> {

    /**
     * Retrieves all contracts based on their current rental availability.
     * @param availabilityStatus True for available cars, False for unavailable/rented.
     * @return List of vehicle contracts matching the status.
     */
    List<VehicleContract> findByAvailabilityStatus(boolean availabilityStatus);

    /**
     * Filters vehicles by both category (e.g., SUV, Sedan) and availability.
     * This is the primary method used by the Customer search portal.
     * @param vehicleType The category of the vehicle.
     * @param availabilityStatus Must be true to show in search results.
     */
    List<VehicleContract> findByVehicleTypeAndAvailabilityStatus(String vehicleType, boolean availabilityStatus);

    /**
     * Specialized Filter: Retrieves all vehicles assigned to a specific Support Agent.
     * Used in the Agent Portal to show only the inventory they are responsible for.
     */
    List<VehicleContract> findByAgentUserId(Long agentId);

    // ========================================================================
    // ANALYTICS & VISUALIZATION QUERIES
    // ========================================================================

    /**
     * Aggregates the total count of vehicles grouped by their category.
     * This data is used by the Admin Dashboard to render Pie Charts and Bar Charts.
     * @return A list of Object arrays where [0] is Vehicle Type and [1] is the Count.
     */
    @Query("SELECT vc.vehicleType, COUNT(vc) FROM VehicleContract vc GROUP BY vc.vehicleType")
    List<Object[]> getVehicleTypeStats();
}