package com.driveease.rental.controller;

import com.driveease.rental.model.User;
import com.driveease.rental.repository.UserRepository;
import com.driveease.rental.config.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * AuthController - Manages User Authentication, Registration, and Profile Management.
 * This controller acts as the entry point for all security-related operations.
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000") // Enabling communication with the React frontend
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * USER LOGIN
     * Authenticates credentials and issues a JWT token.
     * Includes a fix to pass both username and role to the token generator.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        String username = loginRequest.get("username");
        String password = loginRequest.get("password");

        try {
            // 1. Authenticate user credentials using Spring Security
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password)
            );

            // 2. Store authentication object in the security context
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // 3. Retrieve user details to identify the role
            User user = userRepository.findByUsername(username).orElseThrow();
            String userRole = user.getRole().name();

            // 4. Generate JWT Token (passing role as the 2nd parameter)
            String jwtToken = jwtUtils.generateToken(username, userRole);

            // 5. Build response map for the frontend
            Map<String, Object> response = new HashMap<>();
            response.put("token", jwtToken);
            response.put("userId", user.getUserId());
            response.put("username", user.getUsername());
            response.put("role", userRole);

            // 6. Navigation Logic: Directs frontend to the correct dashboard based on role
            String redirectUrl = "/search-results"; // Default for Customers
            if ("ADMIN".equalsIgnoreCase(userRole)) {
                redirectUrl = "/admin";
            } else if ("AGENT".equalsIgnoreCase(userRole)) {
                redirectUrl = "/agent-dashboard";
            }
            response.put("redirectUrl", redirectUrl);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            // Return 401 Unauthorized for failed logins
            return ResponseEntity.status(401).body("Error: Invalid username or password!");
        }
    }

    /**
     * USER SIGNUP
     * Registers a new account and encrypts the password using BCrypt.
     */
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        // Prevent duplicate usernames
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Error: Username is already taken!");
        }

        // Hashing the password before saving to the database for security
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully!");
    }

    /**
     * GET AVAILABLE AGENTS
     * Filters the user list to return only those with the AGENT role.
     * Used for customer-agent assignment dropdowns.
     */
    @GetMapping("/agents")
    public List<User> getAvailableAgents() {
        return userRepository.findAll().stream()
                .filter(user -> user.getRole() != null && "AGENT".equalsIgnoreCase(user.getRole().name()))
                .collect(Collectors.toList());
    }

    // Fetches all registered users for Admin review
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    /**
     * UPDATE USER
     * Modifies user details and re-encrypts password if a new one is provided.
     */
    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setUsername(userDetails.getUsername());

        if(userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
        }

        user.setRole(userDetails.getRole());
        userRepository.save(user);
        return ResponseEntity.ok("User updated successfully!");
    }

    // Permanently removes a user account from the system
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok("User deleted successfully!");
    }
}