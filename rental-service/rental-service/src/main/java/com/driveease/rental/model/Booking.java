package com.driveease.rental.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * The Booking entity represents a finalized car rental transaction in the database.
 * It maps to the 'booking' table and maintains relationships between vehicles,
 * customers, and agents.
 */
@Entity
@Table(name = "booking")
public class Booking {

    /**
     * Unique Primary Key for each booking record.
     * Automatically incremented by the database.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookingId;

    /**
     * Relationship to the specific vehicle contract being booked.
     * A booking must always be linked to a valid contract.
     */
    @ManyToOne
    @JoinColumn(name = "contract_id", nullable = false)
    private VehicleContract vehicleContract;

    /**
     * Relationship to the User who is the Customer.
     * nullable = true allows agents to create bookings even if a
     * registered customer account isn't linked yet.
     */
    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = true)
    private User customer;

    /**
     * Relationship to the User who is the Support Agent handling this booking.
     * Every confirmed booking must be processed by an authorized agent.
     */
    @ManyToOne
    @JoinColumn(name = "agent_id", nullable = false)
    private User agent;

    /**
     * Name of the customer (Useful for guest checkouts or verification).
     */
    private String customerName;

    /**
     * Any special instructions or custom needs provided by the customer.
     */
    private String requirements;

    /**
     * The scheduled date for the vehicle pickup.
     */
    private LocalDate pickupDate;

    /**
     * Total number of days for the rental duration.
     */
    private int rentalDays;

    /**
     * The number of vehicles reserved under this booking.
     */
    private int vehicleCount;

    /**
     * The total calculated cost for the entire rental period.
     * Uses BigDecimal for high financial precision.
     */
    private BigDecimal finalPrice;

    /**
     * Timestamp indicating exactly when the booking was created in the system.
     */
    @Column(nullable = false, updatable = false)
    private LocalDateTime bookingDate;

    /**
     * Lifecycle callback method to automatically set the current
     * timestamp before saving the record for the first time.
     */
    @PrePersist
    protected void onCreate() {
        this.bookingDate = LocalDateTime.now();
    }

    // ========================================================================
    // GETTERS AND SETTERS
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