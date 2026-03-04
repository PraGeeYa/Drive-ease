package com.driveease.rental.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * ContactMessage Entity - Represents user inquiries from the support form.
 * This class is mapped to a database table to persist messages sent by visitors.
 */
@Entity
@Data // Automatically handles Getters, Setters, and toString methods via Lombok
public class ContactMessage {

    /**
     * PRIMARY KEY: Unique ID for each message.
     * Identity strategy ensures the database handles auto-incrementing.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Basic identification of the person reaching out.
     */
    private String firstName;
    private String lastName;

    /**
     * The sender's email address used for follow-up communications.
     */
    private String email;

    /**
     * The primary reason or category for the message (e.g., "Billing", "Fleet Inquiry").
     */
    private String subject;

    /**
     * The core content of the user's inquiry.
     * Uses 'TEXT' definition in SQL to support long paragraphs instead of standard 'VARCHAR(255)'.
     */
    @Column(columnDefinition = "TEXT")
    private String message;

    /**
     * AUDIT FIELD: Captures the exact moment the message was saved.
     * Defaults to the current system time during object creation.
     */
    private LocalDateTime submittedAt = LocalDateTime.now();
}