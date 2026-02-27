package com.driveease.rental.model;

import jakarta.persistence.*;

/**
 * The Customer entity represents a client in the DriveEase system.
 * This class maps to the 'customer' table in the database and stores
 * specific profile information for individuals renting vehicles.
 */
@Entity
@Table(name = "customer")
public class Customer {

    /**
     * Primary Key: Unique identifier for each customer.
     * GenerationType.IDENTITY enables the database to auto-increment the ID.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long customerId;

    /**
     * Stores the full name of the customer.
     */
    private String customerName;

    /**
     * Detailed field for specific rental needs or preferences.
     * The columnDefinition = "TEXT" is used to allow for extensive descriptions
     * that go beyond the default character limits of a standard string column.
     */
    @Column(columnDefinition = "TEXT")
    private String customerRequirements;

    // ========================================================================
    // GETTERS AND SETTERS
    // ========================================================================

    /**
     * Gets the unique ID of the customer.
     */
    public Long getCustomerId() {
        return customerId;
    }

    /**
     * Sets the unique ID of the customer.
     */
    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    /**
     * Gets the full name of the customer.
     */
    public String getCustomerName() {
        return customerName;
    }

    /**
     * Sets the full name of the customer.
     */
    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    /**
     * Gets the specific requirements provided by the customer.
     */
    public String getCustomerRequirements() {
        return customerRequirements;
    }

    /**
     * Sets the specific requirements provided by the customer.
     */
    public void setCustomerRequirements(String customerRequirements) {
        this.customerRequirements = customerRequirements;
    }
}