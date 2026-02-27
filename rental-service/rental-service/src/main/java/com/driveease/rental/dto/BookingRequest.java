package com.driveease.rental.dto;

import lombok.Data;
import java.time.LocalDate;

/**
 * Data Transfer Object (DTO) for Booking Requests.
 * This class is used to transport booking data from the Frontend (React)
 * to the Backend (Spring Boot) during the initial reservation process.
 */
@Data // Lombok annotation to automatically generate Getters, Setters, and toString methods
public class BookingRequest {

    /**
     * Unique identifier for the vehicle contract/listing being booked.
     */
    private Long contractId;

    /**
     * Unique identifier for the customer making the reservation.
     */
    private Long customerId;

    /**
     * The specific date when the customer intends to pick up the vehicle.
     */
    private LocalDate pickupDate;

    /**
     * Total number of days the vehicle will be rented for.
     */
    private int rentalDays;

    /**
     * The quantity of vehicles requested for this specific category.
     */
    private int vehicleCount;
}