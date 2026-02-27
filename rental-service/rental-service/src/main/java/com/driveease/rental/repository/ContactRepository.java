package com.driveease.rental.repository;

import com.driveease.rental.model.ContactMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * ContactRepository provides the data access layer for the ContactMessage entity.
 * It inherits all standard CRUD (Create, Read, Update, Delete) operations from JpaRepository,
 * allowing the system to easily store and retrieve customer inquiries.
 */
@Repository
public interface ContactRepository extends JpaRepository<ContactMessage, Long> {
    // Standard JpaRepository methods handle all basic operations:
    // .save()    - To store a new message from the contact form.
    // .findAll() - To list all inquiries in the Admin Dashboard.
}