package com.driveease.rental.repository;

import com.driveease.rental.model.VehicleContract;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * VehicleContractRepository - Data Access Layer for the Fleet Inventory.
 * This interface manages all vehicle-related database operations, from
 * customer searches to complex admin analytics.
 */
@Repository
public interface VehicleContractRepository extends JpaRepository<VehicleContract, Long> {

    /**
     * AVAILABILITY FILTER:
     * Fetches vehicles based on whether they are ready for rent or not.
     * @param availabilityStatus - True for ready cars, False for booked/maintenance.
     */
    List<VehicleContract> findByAvailabilityStatus(boolean availabilityStatus);

    /**
     * SEARCH ENGINE LOGIC:
     * Combines category filtering with availability checks.
     * This is the heart of the Customer Search Portal.
     * @param vehicleType - e.g., "SUV", "Luxury", "Sedan".
     */
    List<VehicleContract> findByVehicleTypeAndAvailabilityStatus(String vehicleType, boolean availabilityStatus);

    /**
     * AGENT-SPECIFIC INVENTORY:
     * Retrieves all vehicles assigned to a particular Support Agent's profile.
     * Used in the Agent Dashboard to limit their view to their own fleet.
     */
    List<VehicleContract> findByAgentUserId(Long agentId);

    // ========================================================================
    // ANALYTICS & VISUALIZATION SECTION
    // ========================================================================

    /**
     * FLEET COMPOSITION ANALYTICS:
     * Uses JPQL to group vehicles by their type and count them.
     * Essential for rendering Pie Charts and Bar Charts in the Admin Dashboard.
     * @return List of arrays: [0] = Type (String), [1] = Count (Long).
     */
    @Query("SELECT vc.vehicleType, COUNT(vc) FROM VehicleContract vc GROUP BY vc.vehicleType")
    List<Object[]> getVehicleTypeStats();
}