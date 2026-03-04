package com.driveease.rental.controller;

import com.driveease.rental.model.ContactMessage;
import com.driveease.rental.repository.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * ContactController - Manages user communication and support inquiries.
 * This controller provides endpoints to receive messages from visitors and
 * allow administrators to review them.
 */
@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "http://localhost:3000") // Connects with the React frontend
public class ContactController {

    @Autowired
    private ContactRepository contactRepository;

    /**
     * SEND MESSAGE
     * Receives a new inquiry from the "Contact Us" form and saves it to the database.
     * @param contactMessage - The object containing sender info (name, email) and the message body.
     * @return A success response if saved, or a 400 error if processing fails.
     */
    @PostMapping("/send")
    public ResponseEntity<String> sendMessage(@RequestBody ContactMessage contactMessage) {
        try {
            // Persists the customer message to the 'contact_message' table
            contactRepository.save(contactMessage);
            return ResponseEntity.ok("Message sent successfully!");
        } catch (Exception e) {
            // Handles potential database or validation errors
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    /**
     * GET ALL MESSAGES
     * Retrieves every inquiry stored in the system for administrative review.
     * Used by the Admin Dashboard to display the "Messages" tab.
     * @return A list of all ContactMessage entities.
     */
    @GetMapping("/all")
    public ResponseEntity<List<ContactMessage>> getAllMessages() {
        try {
            // Fetches all records from the repository
            List<ContactMessage> messages = contactRepository.findAll();
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            // Standard error response if the server encounters an issue
            return ResponseEntity.internalServerError().build();
        }
    }
}