package com.driveease.rental.repository;

import com.driveease.rental.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * CustomerRepository - The Data Access Layer for Customer Profiles.
 * This interface bridges the gap between the Java application and the
 * 'customer' table in the MySQL database using Spring Data JPA.
 */
@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    /**
     * Note: Since this interface extends JpaRepository, Spring Boot
     * automatically provides implementation for the following methods:
     * * 1. .save(Customer)       - Used during registration or profile updates.
     * 2. .findById(Long)       - Retrieves a customer's details using their Primary Key.
     * 3. .findAll()            - Used by Admin/Agents to list all clients.
     * 4. .deleteById(Long)     - Permanently removes a customer record.
     */
}