package com.driveease.rental.service;

import com.driveease.rental.model.VehicleContract;
import com.driveease.rental.repository.VehicleContractRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

/**
 * BookingService contains the core business logic for the rental system.
 * It handles vehicle availability filtering and complex price calculations.
 */
@Service
public class BookingService {

    private final VehicleContractRepository contractRepository;

    /**
     * Constructor-based dependency injection for the Repository.
     */
    public BookingService(VehicleContractRepository contractRepository) {
        this.contractRepository = contractRepository;
    }

    /**
     * Searches for vehicles that are currently marked as available in the inventory.
     * Logic:
     * 1. If the 'type' is empty or "All", it retrieves every available vehicle.
     * 2. If a specific category (e.g., SUV) is provided, it filters by that type.
     * * @param type The category of vehicle the customer is looking for.
     * @return A list of available vehicle contracts.
     */
    public List<VehicleContract> searchAvailableVehicles(String type) {
        // Handling generic search queries from the frontend
        if (type == null || type.trim().isEmpty() || type.equalsIgnoreCase("All")) {
            // Fetches all records where availability_status = true
            return contractRepository.findByAvailabilityStatus(true);
        }

        // Fetches records filtered by both specific category and active availability
        return contractRepository.findByVehicleTypeAndAvailabilityStatus(type, true);
    }

    /**
     * Calculates the total rental cost for a booking inquiry.
     * Business Rule: A 10% Markup is added to the base rate for service fees.
     * * Formula: (Base Rate * 1.10 Markup) * Rental Days * Vehicle Count
     * * @param baseRate The daily rental price from the contract.
     * @param days Total duration of the rental.
     * @param vehicleCount Number of units requested.
     * @return The final total price as a high-precision BigDecimal.
     */
    public BigDecimal calculateFinalPrice(BigDecimal baseRate, int days, int vehicleCount) {
        // Safety check: Ensuring days and count are at least 1 to prevent zero-pricing errors
        int rentalDays = Math.max(1, days);
        int count = Math.max(1, vehicleCount);

        // Define a 10% markup multiplier (1.10)
        BigDecimal markupMultiplier = new BigDecimal("1.10");

        // Step 1: Apply the 10% service markup to the base daily rate
        BigDecimal rateWithMarkup = baseRate.multiply(markupMultiplier);

        // Step 2: Multiply the adjusted rate by the number of days and the number of vehicles
        return rateWithMarkup
                .multiply(new BigDecimal(rentalDays))
                .multiply(new BigDecimal(count));
    }
}