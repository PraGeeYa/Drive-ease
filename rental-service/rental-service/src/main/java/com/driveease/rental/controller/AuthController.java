package com.driveease.rental.controller;

import com.driveease.rental.model.User;
import com.driveease.rental.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * AuthController manages user security, authentication, and registration.
 * It also handles administrative user management tasks.
 */
@RestController
@RequestMapping("/api/auth")
// @CrossOrigin(origins = "http://localhost:3000") // Enabling this allows frontend connection
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    /**
     * Authenticates a user based on username and password.
     * Generates a dynamic redirect URL based on the user's role.
     * @param loginRequest Map containing 'username' and 'password'
     * @return Response with user ID, username, role, and target redirect path
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        String username = loginRequest.get("username");
        String password = loginRequest.get("password");

        // Attempting to find the user in the database
        Optional<User> userOptional = userRepository.findByUsername(username);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            // Validating the provided password against the stored password
            if (user.getPassword().equals(password)) {
                Map<String, Object> response = new HashMap<>();
                response.put("userId", user.getUserId());
                response.put("username", user.getUsername());

                // Converting the Role Enum to a String for frontend compatibility
                String userRole = user.getRole().name();
                response.put("role", userRole);

                // Determining the entry page based on user authorization level
                String redirectUrl = "/search-results"; // Default for CUSTOMERS
                if ("ADMIN".equalsIgnoreCase(userRole)) {
                    redirectUrl = "/admin";
                } else if ("AGENT".equalsIgnoreCase(userRole)) {
                    redirectUrl = "/agent-dashboard";
                }

                response.put("redirectUrl", redirectUrl);
                return ResponseEntity.ok(response);
            }
        }
        // Returning 401 Unauthorized if credentials fail
        return ResponseEntity.status(401).body("Error: Invalid username or password!");
    }

    /**
     * Filters and returns a list of all users who have the 'AGENT' role.
     * Used by customers to select an agent during the booking process.
     */
    @GetMapping("/agents")
    public List<User> getAvailableAgents() {
        return userRepository.findAll().stream()
                .filter(user -> user.getRole() != null && "AGENT".equalsIgnoreCase(user.getRole().name()))
                .collect(Collectors.toList());
    }

    // ========================================================================
    // ADMINISTRATIVE USER MANAGEMENT
    // ========================================================================

    /**
     * Retrieves all registered users in the system.
     */
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    /**
     * Registers a new user into the system.
     * Includes a check to ensure usernames are unique.
     */
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Error: Username is already taken!");
        }
        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully!");
    }

    /**
     * Updates an existing user's profile information.
     */
    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setUsername(userDetails.getUsername());
        user.setPassword(userDetails.getPassword());
        user.setRole(userDetails.getRole()); // Direct Enum assignment
        userRepository.save(user);
        return ResponseEntity.ok("User updated successfully!");
    }

    /**
     * Permanently removes a user account from the system.
     */
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok("User deleted successfully!");
    }
}