package com.driveease.rental.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * The ContactMessage entity represents a customer inquiry or support message.
 * This class maps directly to a table in the database to store feedback
 * or questions submitted through the 'Contact Us' form.
 */
@Entity
@Data // Lombok annotation to generate getters, setters, and utility methods automatically
public class ContactMessage {

    /**
     * Unique Identifier for each message.
     * GenerationType.IDENTITY ensures the ID is auto-incremented by the database.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Personal details of the sender.
     */
    private String firstName;
    private String lastName;

    /**
     * Contact email address provided by the user for replies.
     */
    private String email;

    /**
     * A brief headline or category for the user's message.
     */
    private String subject;

    /**
     * The detailed content of the inquiry.
     * The columnDefinition = "TEXT" allows for long messages that
     * exceed the standard 255 character limit.
     */
    @Column(columnDefinition = "TEXT")
    private String message;

    /**
     * Automatically records the exact timestamp when the message was sent.
     * Initialized to current system time by default.
     */
    private LocalDateTime submittedAt = LocalDateTime.now();
}