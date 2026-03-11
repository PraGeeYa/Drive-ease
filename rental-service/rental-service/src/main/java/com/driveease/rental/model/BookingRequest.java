package com.driveease.rental.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * BookingRequest Entity - Represents the database structure for rental requests.
 * This class maps directly to the 'booking_request' table in MySQL.
 */
@Entity
@Table(name = "booking_request")
@Data // Lombok: Automatically generates Getters, Setters, and helper methods
public class BookingRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long requestId; // Primary Key: Auto-incremented ID

    // Relationship: Multiple requests can belong to one Customer (User)
    @ManyToOne
    @JoinColumn(name = "customer_id")
    private User customer;

    private String customerEmail;

    // Relationship: Multiple requests can be managed by one Agent (User)
    @ManyToOne
    @JoinColumn(name = "agent_id")
    private User agent;

    // Relationship: Each request is linked to a specific Vehicle Contract
    @ManyToOne
    @JoinColumn(name = "contract_id")
    private VehicleContract vehicleContract;

    private String vehicleType;

    // Financial field: Uses BigDecimal for precise currency calculations
    private BigDecimal finalPrice;

    // Status tracking: Default value is set to "PENDING"
    private String status = "PENDING";

    // Timestamp: Stores the exact date and time the request was created
    private LocalDateTime requestDate = LocalDateTime.now();
}