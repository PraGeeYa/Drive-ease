package com.driveease.rental.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * VehicleContract Entity - Represents the core inventory items in the fleet.
 */
@Entity
@Table(name = "vehicle_contract")
public class VehicleContract {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long contractId;

    private String vehicleType;

    private BigDecimal baseRatePerDay;

    private int allowedMileage;

    private boolean availabilityStatus;

    @Column(name = "image_url", length = 1000)
    private String imageUrl;

    @ManyToOne
    @JoinColumn(name = "provider_id")
    private Provider provider;

    @ManyToOne
    @JoinColumn(name = "agent_id")
    private User agent;

    /**
     * 🔥 Relationship to Bookings with CASCADE DELETE.
     */
    @OneToMany(mappedBy = "vehicleContract", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Booking> bookings;

    /**
     * 🔥 ADDED: Relationship to BookingRequests with CASCADE DELETE.
     * This fixes the SQL Integrity Violation by allowing requests to be deleted automatically.
     */
    @OneToMany(mappedBy = "vehicleContract", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<BookingRequest> bookingRequests;

    // ========================================================================
    // GETTERS AND SETTERS
    // ========================================================================

    public Long getContractId() { return contractId; }
    public void setContractId(Long contractId) { this.contractId = contractId; }

    public String getVehicleType() { return vehicleType; }
    public void setVehicleType(String vehicleType) { this.vehicleType = vehicleType; }

    public BigDecimal getBaseRatePerDay() { return baseRatePerDay; }
    public void setBaseRatePerDay(BigDecimal baseRatePerDay) { this.baseRatePerDay = baseRatePerDay; }

    public int getAllowedMileage() { return allowedMileage; }
    public void setAllowedMileage(int allowedMileage) { this.allowedMileage = allowedMileage; }

    public boolean getAvailabilityStatus() { return availabilityStatus; }
    public boolean isAvailabilityStatus() { return availabilityStatus; }
    public void setAvailabilityStatus(boolean availabilityStatus) { this.availabilityStatus = availabilityStatus; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Provider getProvider() { return provider; }
    public void setProvider(Provider provider) { this.provider = provider; }

    public User getAgent() { return agent; }
    public void setAgent(User agent) { this.agent = agent; }

    public List<Booking> getBookings() { return bookings; }
    public void setBookings(List<Booking> bookings) { this.bookings = bookings; }

    // 🔥 Added Getters/Setters for bookingRequests
    public List<BookingRequest> getBookingRequests() { return bookingRequests; }
    public void setBookingRequests(List<BookingRequest> bookingRequests) { this.bookingRequests = bookingRequests; }
}