package com.driveease.rental.controller;

import com.driveease.rental.model.ContactMessage;
import com.driveease.rental.repository.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * ContactController handles all communication-related requests.
 * It primarily manages customer inquiries sent through the "Contact Us" portal.
 */
@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "http://localhost:3000") // Allowing cross-origin requests from the React Frontend
public class ContactController {

    @Autowired
    private ContactRepository contactRepository;

    /**
     * Receives and persists a contact message sent by a customer or visitor.
     * This endpoint is called when the user submits the contact form.
     * * @param contactMessage The data object containing sender details and their message.
     * @return Success message on successful save, or an error message if it fails.
     */
    @PostMapping("/send")
    public ResponseEntity<String> sendMessage(@RequestBody ContactMessage contactMessage) {
        try {
            // Persisting the incoming message object into the database
            contactRepository.save(contactMessage);
            return ResponseEntity.ok("Message sent successfully!");
        } catch (Exception e) {
            // Returning a 400 Bad Request if something goes wrong during the save process
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    /**
     * Retrieves the full list of all contact messages received.
     * This is typically used by the Admin Dashboard to review customer inquiries.
     * * @return A list of all ContactMessage entities stored in the system.
     */
    @GetMapping("/all")
    public ResponseEntity<List<ContactMessage>> getAllMessages() {
        try {
            // Fetching all records from the contact table via the repository
            List<ContactMessage> messages = contactRepository.findAll();
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            // Returning a 500 Internal Server Error if database retrieval fails
            return ResponseEntity.internalServerError().build();
        }
    }
}