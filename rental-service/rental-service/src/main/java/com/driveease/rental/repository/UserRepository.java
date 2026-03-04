package com.driveease.rental.repository;

import com.driveease.rental.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * UserRepository - Data Access Layer for the User Entity.
 * This interface handles authentication-related queries and role-based
 * user filtering for the DriveEase security system.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * AUTHENTICATION QUERY:
     * Retrieves a user profile by their unique username.
     * This is the heart of the Login logic, allowing Spring Security to
     * verify if a user exists before checking their password.
     * * @param username - The unique identifier entered during login.
     * @return An Optional wrapper containing the User, helping prevent NullPointerExceptions.
     */
    Optional<User> findByUsername(String username);

    /**
     * ROLE-BASED FILTERING:
     * Fetches a group of users who share the same access level (e.g., all AGENTS).
     * Used by the Admin Dashboard to manage specific staff or customer lists.
     * * @param role - The User.Role enum value (ADMIN, AGENT, or CUSTOMER).
     * @return A list of users belonging to the specified category.
     */
    List<User> findByRole(User.Role role);
}