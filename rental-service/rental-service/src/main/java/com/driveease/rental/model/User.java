package com.driveease.rental.model;

import jakarta.persistence.*;
import lombok.Data; // Lombok for boilerplate reduction

/**
 * The User entity handles core authentication and authorization data.
 * This class maps to the 'user' table and defines the identity
 * of everyone accessing the DriveEase system.
 */
@Entity
@Table(name = "user")
@Data // Automatically generates Getters, Setters, Equals, HashCode and ToString methods
public class User {

    /**
     * Unique Primary Key for each user account.
     * Auto-incremented by the database.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    /**
     * Unique identifier for login purposes.
     * Cannot be null and must be unique across the entire database.
     */
    @Column(unique = true, nullable = false)
    private String username;

    /**
     * Encrypted or plain text password for account security.
     * Cannot be null.
     */
    @Column(nullable = false)
    private String password;

    /**
     * User's contact email address.
     * Marked as unique to prevent duplicate account registrations with the same email.
     */
    @Column(unique = true)
    private String email;

    /**
     * Defines the authorization level of the user using an Enumerated type.
     * EnumType.STRING stores the role name (e.g., 'ADMIN') as text in the database column.
     */
    @Enumerated(EnumType.STRING)
    private Role role;

    /**
     * Enum defining the specific user types permitted in the system.
     */
    public enum Role {
        ADMIN,      // Full system access and reporting
        AGENT,      // Managing assigned vehicle bookings and requests
        CUSTOMER    // Searching vehicles and submitting booking inquiries
    }

    // No manual Getters or Setters are needed here due to the @Data annotation from Lombok.
}