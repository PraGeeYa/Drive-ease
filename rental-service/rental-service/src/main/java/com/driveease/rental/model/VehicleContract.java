package com.driveease.rental.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

/**
 * VehicleContract Entity - Represents the core inventory items in the fleet.
 * This class links vehicle types with pricing, suppliers (Providers),
 * and responsible management personnel (Agents).
 */
@Entity
@Table(name = "vehicle_contract")
public class VehicleContract {

    /**
     * PRIMARY KEY: Unique identifier for each vehicle listing.
     * The database handles auto-increment logic via IDENTITY strategy.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long contractId;

    /**
     * Stores the category or model of the vehicle (e.g., Sedan, SUV, EV).
     */
    private String vehicleType;

    /**
     * The standard daily rental rate.
     * Uses BigDecimal to prevent floating-point errors in financial calculations.
     */
    private BigDecimal baseRatePerDay;

    /**
     * The maximum daily distance (km) included in the base rate.
     */
    private int allowedMileage;

    /**
     * Current status of the asset.
     * True = Ready for booking, False = Under maintenance or booked.
     */
    private boolean availabilityStatus;

    /**
     * RELATIONSHIP: Links the vehicle to its legal owner/supplier.
     * A single Provider can offer multiple vehicle contracts.
     */
    @ManyToOne
    @JoinColumn(name = "provider_id")
    private Provider provider;

    /**
     * RELATIONSHIP: Links the vehicle to a specific Support Agent.
     * This allows agents to see and manage their own assigned inventory
     * in the Agent Dashboard.
     */
    @ManyToOne
    @JoinColumn(name = "agent_id")
    private User agent;

    // ========================================================================
    // GETTERS AND SETTERS (Standard Boilerplate)
    // ========================================================================

    public Long getContractId() { return contractId; }
    public void setContractId(Long contractId) { this.contractId = contractId; }

    public String getVehicleType() { return vehicleType; }
    public void setVehicleType(String vehicleType) { this.vehicleType = vehicleType; }

    public BigDecimal getBaseRatePerDay() { return baseRatePerDay; }
    public void setBaseRatePerDay(BigDecimal baseRatePerDay) { this.baseRatePerDay = baseRatePerDay; }

    /**
     * Helper getter for boolean status.
     * Required by some JSON serializers and Controllers.
     */
    public boolean getAvailabilityStatus() { return availabilityStatus; }

    /**
     * Standard boolean 'is' getter for logical checks.
     */
    public boolean isAvailabilityStatus() { return availabilityStatus; }
    public void setAvailabilityStatus(boolean availabilityStatus) { this.availabilityStatus = availabilityStatus; }

    public Provider getProvider() { return provider; }
    public void setProvider(Provider provider) { this.provider = provider; }

    /**
     * Retrieves the managing support agent.
     */
    public User getAgent() { return agent; }

    /**
     * Assigns a manager (agent) to this fleet asset.
     */
    public void setAgent(User agent) { this.agent = agent; }
}