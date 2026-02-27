package com.driveease.rental.repository;

import com.driveease.rental.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * CustomerRepository acts as the Data Access Object (DAO) for the Customer entity.
 * It provides the necessary abstraction to perform CRUD operations on the
 * 'customer' table without writing complex SQL queries.
 */
@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    // By extending JpaRepository, this interface automatically inherits methods like:
    // .save(Customer)       - To create or update customer profiles.
    // .findById(Long)       - To retrieve a specific customer by their ID.
    // .findAll()            - To list all registered customers in the system.
    // .deleteById(Long)     - To remove a customer record.
}