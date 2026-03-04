package com.driveease.rental.repository;

import com.driveease.rental.model.Provider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * ProviderRepository - Data Access Layer for third-party vehicle suppliers.
 * This interface bridges the gap between the application logic and the
 * 'provider' database table using Spring Data JPA's automated methods.
 */
@Repository
public interface ProviderRepository extends JpaRepository<Provider, Long> {

    /**
     * Note: Since this interface extends JpaRepository, Spring Boot
     * automatically generates the following functionality at runtime:
     * * 1. .save(Provider)      - Used by Admin to register new car suppliers.
     * 2. .findById(Long)      - Retrieves a provider's profile using their Primary Key.
     * 3. .findAll()           - Fetches all suppliers for the Admin Dashboard view.
     * 4. .deleteById(Long)    - Permanently removes a supplier from the database.
     */
}