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
 * AuthController - Handles user registration, authentication (Login),
 * and User Management operations.
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173") // Allow React frontend to access
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
     * POST: LOGIN
     * Verifies credentials and returns a JWT token if successful.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        String username = loginRequest.get("username");
        String password = loginRequest.get("password");
        try {
            // Validate the credentials using Spring Security's AuthenticationManager
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password)
            );

            // Set the authentication in the global Security Context
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Fetch user details from DB to get their role
            User user = userRepository.findByUsername(username).orElseThrow();
            String userRole = user.getRole().name();

            // Generate a JWT Token to be sent to the client
            String jwtToken = jwtUtils.generateToken(username, userRole);

            // Construct the JSON response
            Map<String, Object> response = new HashMap<>();
            response.put("token", jwtToken);
            response.put("userId", user.getUserId());
            response.put("username", user.getUsername());
            response.put("role", userRole);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // Return 401 Unauthorized if login fails
            return ResponseEntity.status(401).body("Error: Invalid username or password!");
        }
    }

    /**
     * POST: SIGNUP
     * Registers a new user and hashes their password for security.
     */
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        // Check if username already exists in the database
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Error: Username is already taken!");
        }

        // Encrypt the plain text password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully!");
    }

    /**
     * GET: ALL USERS
     * Retrieves a list of all registered users for the Admin.
     */
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    /**
     * GET: USER BY ID
     */
    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * PUT: UPDATE USER
     * Updates profile details like username, email, and optionally password.
     */
    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setUsername(userDetails.getUsername());
        user.setEmail(userDetails.getEmail());

        // Update password only if a new one is provided
        if(userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
        }
        userRepository.save(user);
        return ResponseEntity.ok("User updated successfully!");
    }

    /**
     * DELETE: DELETE USER
     */
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok("User deleted successfully!");
    }

    /**
     * GET: FILTER AGENTS
     * Returns a list of users whose role is 'AGENT'.
     */
    @GetMapping("/agents")
    public List<User> getAvailableAgents() {
        return userRepository.findAll().stream()
                .filter(user -> user.getRole() != null && "AGENT".equalsIgnoreCase(user.getRole().name()))
                .collect(Collectors.toList());
    }
}