package com.driveease.rental.repository;

import com.driveease.rental.model.ContactMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * ContactRepository - The Data Access Layer for site-wide communications.
 * This interface bridges the gap between the Java application and the
 * 'contact_message' database table using Spring Data JPA.
 */
@Repository
public interface ContactRepository extends JpaRepository<ContactMessage, Long> {

    /**
     * Note: Since this interface extends JpaRepository, we don't need to write
     * common methods manually. Spring Boot automatically provides:
     * * 1. .save(ContactMessage) - Used by ContactController to store new inquiries.
     * 2. .findAll()            - Used by Admin Dashboard to review all feedback.
     * 3. .deleteById(Long)      - For cleaning up old or spam messages.
     */
}