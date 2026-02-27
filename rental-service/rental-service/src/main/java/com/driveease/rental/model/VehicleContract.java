package com.driveease.rental.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

/**
 * The VehicleContract entity represents a specific car rental listing or contract.
 * It stores vehicle specifications, pricing details, and links the vehicle
 * to both a Provider (Supplier) and a Support Agent (Manager).
 */
@Entity
@Table(name = "vehicle_contract")
public class VehicleContract {

    /**
     * Unique Identifier for each vehicle contract.
     * GenerationType.IDENTITY ensures the DB handles auto-incrementing the ID.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long contractId;

    /**
     * Categorizes the vehicle (e.g., SUV, Sedan, Luxury).
     */
    private String vehicleType;

    /**
     * The daily rental cost.
     * BigDecimal is used to maintain financial accuracy for currency values.
     */
    private BigDecimal baseRatePerDay;

    /**
     * Maximum distance (in km or miles) permitted per day without extra charges.
     */
    private int allowedMileage;

    /**
     * Boolean flag to track if the vehicle is currently available for rent.
     * True = Available, False = Maintenance/Already Rented.
     */
    private boolean availabilityStatus;

    /**
     * Relationship to the Provider (Supplier) who owns the vehicle.
     * Multiple contracts can belong to a single provider (Many-to-One).
     */
    @ManyToOne
    @JoinColumn(name = "provider_id")
    private Provider provider;

    /**
     * Relationship to the Support Agent assigned to manage this vehicle's inventory.
     * This connection allows filtering inventory based on the logged-in agent.
     */
    @ManyToOne
    @JoinColumn(name = "agent_id")
    private User agent;

    // ========================================================================
    // GETTERS AND SETTERS
    // ========================================================================

    public Long getContractId() { return contractId; }
    public void setContractId(Long contractId) { this.contractId = contractId; }

    public String getVehicleType() { return vehicleType; }
    public void setVehicleType(String vehicleType) { this.vehicleType = vehicleType; }

    public BigDecimal getBaseRatePerDay() { return baseRatePerDay; }
    public void setBaseRatePerDay(BigDecimal baseRatePerDay) { this.baseRatePerDay = baseRatePerDay; }

    public boolean isAvailabilityStatus() { return availabilityStatus; }
    public void setAvailabilityStatus(boolean availabilityStatus) { this.availabilityStatus = availabilityStatus; }

    public Provider getProvider() { return provider; }
    public void setProvider(Provider provider) { this.provider = provider; }

    /**
     * Gets the support agent assigned to this contract.
     */
    public User getAgent() { return agent; }

    /**
     * Assigns a specific support agent to manage this vehicle contract.
     */
    public void setAgent(User agent) { this.agent = agent; }
}