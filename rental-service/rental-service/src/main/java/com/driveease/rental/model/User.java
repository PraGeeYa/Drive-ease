package com.driveease.rental.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * User Entity - The core identity model for DriveEase.
 * This class maps to the 'user' table in the database and handles
 * authentication and role-based access control.
 */
@Entity
@Table(name = "user")
@Data
@NoArgsConstructor  // Essential for JPA to instantiate the entity from database rows
@AllArgsConstructor // Useful for creating users in test cases or seed data
public class User {

    /**
     * PRIMARY KEY: Unique identifier for each user.
     * Maps specifically to the 'user_id' column in the MySQL table.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    /**
     * Unique username used for login. Cannot be null.
     */
    @Column(unique = true, nullable = false)
    private String username;

    /**
     * Encrypted password string. For security, this should never be stored in plain text.
     */
    @Column(nullable = false)
    private String password;

    /**
     * User's primary contact email. Must be unique across the system.
     */
    @Column(unique = true)
    private String email;

    /**
     * ENUMERATED ROLE: Defines the level of access the user has.
     * Stored as a String in the database for better readability.
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    /**
     * Roles available within the DriveEase ecosystem.
     */
    public enum Role {
        ADMIN,    // Full system control
        AGENT,    // Manages requests and fleet
        CUSTOMER  // Browses and requests vehicles
    }
}