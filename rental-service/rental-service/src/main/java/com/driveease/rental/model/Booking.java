package com.driveease.rental.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Booking Entity - Represents a finalized car rental transaction.
 * This class maps directly to the 'booking' table in the MySQL database.
 */
@Entity
@Table(name = "booking")
public class Booking {

    /**
     * PRIMARY KEY: Unique identifier for each booking.
     * GenerationType.IDENTITY ensures auto-increment behavior in the database.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookingId;

    /**
     * RELATIONSHIP: Links the booking to a specific vehicle class/rate.
     * @ManyToOne indicates that many bookings can be made for one vehicle contract.
     */
    @ManyToOne
    @JoinColumn(name = "contract_id", nullable = false)
    private VehicleContract vehicleContract;

    /**
     * RELATIONSHIP: Links the booking to the Customer.
     * Set to nullable=true to support flexible scenarios where a profile might not exist yet.
     */
    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = true)
    private User customer;

    /**
     * RELATIONSHIP: Links the booking to the Support Agent.
     * Mandates that every booking must have a handling agent assigned.
     */
    @ManyToOne
    @JoinColumn(name = "agent_id", nullable = false)
    private User agent;

    /**
     * Stores the customer's display name for quick reference and guest tracking.
     */
    private String customerName;

    /**
     * Captures custom notes, such as baby seats, chauffeur needs, or special routes.
     */
    private String requirements;

    /**
     * The date the customer plans to collect the vehicle.
     */
    private LocalDate pickupDate;

    /**
     * The duration of the rental agreement in days.
     */
    private int rentalDays;

    /**
     * The number of units of the chosen vehicle type reserved in this transaction.
     */
    private int vehicleCount;

    /**
     * The total financial value of the deal.
     * BigDecimal is used to avoid floating-point rounding errors in money.
     */
    private BigDecimal finalPrice;

    /**
     * AUDIT FIELD: Automatically records when the transaction entered the system.
     */
    @Column(nullable = false, updatable = false)
    private LocalDateTime bookingDate;

    /**
     * ENTITY CALLBACK: Sets the 'bookingDate' automatically just before the row is created.
     */
    @PrePersist
    protected void onCreate() {
        this.bookingDate = LocalDateTime.now();
    }

    // ========================================================================
    // GETTERS AND SETTERS (Standard Boilerplate)
    // ========================================================================

    public Long getBookingId() { return bookingId; }
    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }

    public VehicleContract getVehicleContract() { return vehicleContract; }
    public void setVehicleContract(VehicleContract vehicleContract) { this.vehicleContract = vehicleContract; }

    public User getCustomer() { return customer; }
    public void setCustomer(User customer) { this.customer = customer; }

    public User getAgent() { return agent; }
    public void setAgent(User agent) { this.agent = agent; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getRequirements() { return requirements; }
    public void setRequirements(String requirements) { this.requirements = requirements; }

    public LocalDate getPickupDate() { return pickupDate; }
    public void setPickupDate(LocalDate pickupDate) { this.pickupDate = pickupDate; }

    public int getRentalDays() { return rentalDays; }
    public void setRentalDays(int rentalDays) { this.rentalDays = rentalDays; }

    public int getVehicleCount() { return vehicleCount; }
    public void setVehicleCount(int vehicleCount) { this.vehicleCount = vehicleCount; }

    public BigDecimal getFinalPrice() { return finalPrice; }
    public void setFinalPrice(BigDecimal finalPrice) { this.finalPrice = finalPrice; }
}