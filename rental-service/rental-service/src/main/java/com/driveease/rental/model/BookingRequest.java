package com.driveease.rental.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * BookingRequest Entity - Represents a customer's initial vehicle inquiry.
 * Updated to include email tracking for automated notifications.
 */
@Entity
@Table(name = "booking_request")
@Data
public class BookingRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long requestId;

    /**
     * RELATIONSHIP: The user who is requesting the vehicle.
     */
    @ManyToOne
    @JoinColumn(name = "customer_id")
    private User customer;

    /**
     * NEW FIELD: Stores the customer's email directly in the request.
     * This ensures the EmailService can always find a recipient address
     * even if the User profile is updated later.
     */
    private String customerEmail;

    /**
     * RELATIONSHIP: The Support Agent assigned to evaluate this request.
     */
    @ManyToOne
    @JoinColumn(name = "agent_id")
    private User agent;

    /**
     * RELATIONSHIP: Link to the specific fleet item (contract) being requested.
     */
    @ManyToOne
    @JoinColumn(name = "contract_id")
    private VehicleContract vehicleContract;

    /**
     * Denormalized field for fast display in the Agent Dashboard.
     */
    private String vehicleType;

    /**
     * Calculated final price for the inquiry.
     */
    private BigDecimal finalPrice;

    /**
     * Lifecycle status: PENDING, APPROVED, REJECTED.
     */
    private String status = "PENDING";

    /**
     * The exact timestamp of the inquiry.
     */
    private LocalDateTime requestDate = LocalDateTime.now();
}