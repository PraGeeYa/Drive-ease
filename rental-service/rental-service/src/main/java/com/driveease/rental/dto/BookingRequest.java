package com.driveease.rental.dto;

import lombok.Data;
import java.time.LocalDate;

/**
 * BookingRequest DTO - Facilitates structured data transfer.
 * This class acts as a specialized container to carry booking information
 * from the React frontend to the Spring Boot REST controllers.
 */
@Data // Automatically generates all getters, setters, equals, hashCode, and toString methods via Lombok
public class BookingRequest {

    /**
     * Unique ID of the vehicle inventory item (contract) selected by the user.
     */
    private Long contractId;

    /**
     * Unique ID of the registered user (customer) who is initiating the booking.
     */
    private Long customerId;

    /**
     * The planned date for vehicle collection.
     * Uses ISO format (YYYY-MM-DD) for seamless JSON parsing.
     */
    private LocalDate pickupDate;

    /**
     * The duration of the rental period in days.
     * Used for final price calculation in the service layer.
     */
    private int rentalDays;

    /**
     * The number of units requested for the specific vehicle type.
     */
    private int vehicleCount;
}