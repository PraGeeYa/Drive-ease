package com.driveease.rental.repository;

import com.driveease.rental.model.Provider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * ProviderRepository acts as the Data Access Layer for the Provider entity.
 * It leverages Spring Data JPA to provide standard database operations
 * for managing third-party vehicle suppliers.
 */
@Repository
public interface ProviderRepository extends JpaRepository<Provider, Long> {

    // This interface automatically inherits powerful methods from JpaRepository:
    // .save(Provider)      - To register a new car supplier or update existing ones.
    // .findById(Long)      - To find a specific provider using their ID.
    // .findAll()           - To list all providers for the Admin Dashboard.
    // .deleteById(Long)    - To remove a supplier from the system.
}