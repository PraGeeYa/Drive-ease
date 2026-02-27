package com.driveease.rental.repository;

import com.driveease.rental.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * UserRepository provides the data access layer for the User entity.
 * It handles core authentication queries and user role filtering,
 * bridging the gap between the database and the security logic.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Retrieves a user based on their unique username.
     * This is primarily used during the Login process to verify credentials.
     * @param username The unique username entered by the user.
     * @return An Optional containing the User if found, or empty if not.
     */
    Optional<User> findByUsername(String username);

    /**
     * Filters and retrieves a list of users based on their specific Role (Enum).
     * This is useful for listing all Agents or Admins in the system.
     * @param role The Enum value (ADMIN, AGENT, CUSTOMER).
     * @return A list of users matching the specified role.
     */
    List<User> findByRole(User.Role role);
}