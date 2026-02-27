package com.driveease.rental.model;

import jakarta.persistence.*;
import lombok.Data;

/**
 * The Provider entity represents a third-party vehicle supplier or rental partner.
 * This class maps to the 'provider' table in the database and stores
 * essential contact information for business entities offering their fleet.
 */
@Entity
@Table(name = "provider")
@Data // Lombok annotation: Automatically generates Getters, Setters, toString, and RequiredArgsConstructor
public class Provider {

    /**
     * Primary Key: Unique identifier for each car provider.
     * GenerationType.IDENTITY ensures the database handles the auto-increment logic.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long providerId;

    /**
     * The legal or business name of the car rental provider (e.g., "DriveEase Elite Suppliers").
     */
    private String providerName;

    /**
     * Stores contact information such as phone numbers, office address, or email
     * associated with the provider for administrative inquiries.
     */
    private String contactDetails;
}