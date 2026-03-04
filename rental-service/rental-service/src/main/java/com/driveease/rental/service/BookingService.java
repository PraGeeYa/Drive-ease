package com.driveease.rental.service;

import com.driveease.rental.model.VehicleContract;
import com.driveease.rental.repository.VehicleContractRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

/**
 * BookingService - The Core Business Logic Layer.
 * This service handles decision-making processes such as vehicle filtering
 * and dynamic price calculations for the DriveEase rental system.
 */
@Service
public class BookingService {

    private final VehicleContractRepository contractRepository;

    /**
     * CONSTRUCTOR INJECTION:
     * Injecting the VehicleContractRepository to interact with the database.
     */
    public BookingService(VehicleContractRepository contractRepository) {
        this.contractRepository = contractRepository;
    }

    /**
     * SEARCH LOGIC:
     * Filters the fleet based on customer preferences and real-time availability.
     * * @param type - The vehicle category (e.g., SUV, Sedan, All).
     * @return A filtered list of available vehicle contracts.
     */
    public List<VehicleContract> searchAvailableVehicles(String type) {
        // Rule: If no specific type is selected, show all available vehicles in the fleet.
        if (type == null || type.trim().isEmpty() || type.equalsIgnoreCase("All")) {
            return contractRepository.findByAvailabilityStatus(true);
        }

        // Rule: If a category is chosen, fetch only those that match AND are available.
        return contractRepository.findByVehicleTypeAndAvailabilityStatus(type, true);
    }

    /**
     * PRICING ENGINE:
     * Calculates the total rental cost including a service markup.
     * * Business Rule: A 10% service fee is added to the base rate.
     * Formula: (Base Rate * 1.10 Markup) * Rental Days * Vehicle Count
     * * @param baseRate - Daily price from the contract.
     * @param days - Total duration of the trip.
     * @param vehicleCount - Total number of cars requested.
     * @return Final high-precision total price.
     */
    public BigDecimal calculateFinalPrice(BigDecimal baseRate, int days, int vehicleCount) {
        // Safety: Ensure rental duration and car count are at least 1.
        int rentalDays = Math.max(1, days);
        int count = Math.max(1, vehicleCount);

        // Constants: Defining the 10% markup (1.10).
        BigDecimal markupMultiplier = new BigDecimal("1.10");

        // Step 1: Apply the 10% markup to the base daily rate.
        BigDecimal rateWithMarkup = baseRate.multiply(markupMultiplier);

        // Step 2: Multiply by days and quantity to get the final bill.
        return rateWithMarkup
                .multiply(new BigDecimal(rentalDays))
                .multiply(new BigDecimal(count));
    }
}