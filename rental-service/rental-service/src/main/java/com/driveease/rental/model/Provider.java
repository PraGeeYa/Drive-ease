package com.driveease.rental.model;

import jakarta.persistence.*;
import lombok.Data;

/**
 * Provider Entity - Represents a third-party vehicle supplier or partner.
 * This class maps directly to the 'provider' table in the MySQL database
 * and stores administrative data for fleet contributors.
 */
@Entity
@Table(name = "provider")
@Data // Automatically generates all Getters, Setters, toString, and Equals methods via Lombok
public class Provider {

    /**
     * PRIMARY KEY: Unique identifier for each rental partner.
     * The IDENTITY strategy relies on the database's auto-increment feature.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long providerId;

    /**
     * Stores the official business name of the vehicle supplier
     * (e.g., "Elite Motors", "DriveEase Partners").
     */
    private String providerName;

    /**
     * Captures essential contact data such as phone numbers, email, or physical
     * office address for backend administrative use.
     */
    private String contactDetails;

    private String phoneNo;
    private String email;
    private String address;
}