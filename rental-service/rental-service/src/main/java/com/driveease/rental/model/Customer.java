package com.driveease.rental.model;

import jakarta.persistence.*;

/**
 * Customer Entity - Represents a client within the DriveEase ecosystem.
 * This class is mapped to the 'customer' table in the database to persist
 * individual profile data and rental preferences.
 */
@Entity
@Table(name = "customer")
public class Customer {

    /**
     * PRIMARY KEY: Unique identifier for each customer record.
     * The IDENTITY strategy allows the MySQL database to handle auto-incrementing the ID.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long customerId;

    /**
     * Stores the legal or display name of the customer.
     */
    private String customerName;

    /**
     * Captures specific needs, such as preferred car models, chauffeur requirements,
     * or accessibility needs.
     * Using 'TEXT' allows the database to store much longer descriptions than a standard VARCHAR.
     */
    @Column(columnDefinition = "TEXT")
    private String customerRequirements;

    // ========================================================================
    // GETTERS AND SETTERS (Standard Boilerplate)
    // ========================================================================

    /**
     * Retrieves the database-generated ID for this customer.
     */
    public Long getCustomerId() {
        return customerId;
    }

    /**
     * Assigns a unique ID to the customer (handled automatically by JPA).
     */
    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    /**
     * Retrieves the customer's full name.
     */
    public String getCustomerName() {
        return customerName;
    }

    /**
     * Updates the customer's full name.
     */
    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    /**
     * Retrieves the specific instructions or notes provided by the customer.
     */
    public String getCustomerRequirements() {
        return customerRequirements;
    }

    /**
     * Updates the specific instructions or requirements for the customer's profile.
     */
    public void setCustomerRequirements(String customerRequirements) {
        this.customerRequirements = customerRequirements;
    }
}