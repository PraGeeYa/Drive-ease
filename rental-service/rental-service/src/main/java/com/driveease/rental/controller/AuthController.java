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

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
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
     * User Login: Authenticates and returns JWT
     * 🔥 Fixed: generateToken method eka parameters 2k ekka update kala
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        String username = loginRequest.get("username");
        String password = loginRequest.get("password");

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password)
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            User user = userRepository.findByUsername(username).orElseThrow();
            String userRole = user.getRole().name();

            // 🔥 MEKA THAMAI FIX EKA: userRole eka 2nd parameter widiyata danna oni
            String jwtToken = jwtUtils.generateToken(username, userRole);

            Map<String, Object> response = new HashMap<>();
            response.put("token", jwtToken);
            response.put("userId", user.getUserId());
            response.put("username", user.getUsername());
            response.put("role", userRole);

            // Redirect Logic
            String redirectUrl = "/search-results";
            if ("ADMIN".equalsIgnoreCase(userRole)) {
                redirectUrl = "/admin";
            } else if ("AGENT".equalsIgnoreCase(userRole)) {
                redirectUrl = "/agent-dashboard";
            }
            response.put("redirectUrl", redirectUrl);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(401).body("Error: Invalid username or password!");
        }
    }

    /**
     * User Signup: Hashes password before saving to DB
     */
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Error: Username is already taken!");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully!");
    }

    @GetMapping("/agents")
    public List<User> getAvailableAgents() {
        return userRepository.findAll().stream()
                .filter(user -> user.getRole() != null && "AGENT".equalsIgnoreCase(user.getRole().name()))
                .collect(Collectors.toList());
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

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

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok("User deleted successfully!");
    }
}