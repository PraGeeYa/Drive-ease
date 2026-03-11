package com.driveease.rental.controller;

import com.driveease.rental.model.Provider;
import com.driveease.rental.model.VehicleContract;
import com.driveease.rental.model.User;
import com.driveease.rental.repository.ProviderRepository;
import com.driveease.rental.repository.VehicleContractRepository;
import com.driveease.rental.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * AdminController - Handles all administrative actions for managing the system.
 */
@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}) // 🔥 FIXED: Vite port 5173 added
public class AdminController {

    @Autowired
    private VehicleContractRepository contractRepository;

    @Autowired
    private ProviderRepository providerRepository;

    @Autowired
    private UserRepository userRepository;

    // ==========================================
    // SECTION: PROVIDER MANAGEMENT
    // ==========================================

    @GetMapping("/providers")
    public List<Provider> getAllProviders() {
        return providerRepository.findAll();
    }

    @PostMapping("/providers")
    public Provider addProvider(@RequestBody Provider provider) {
        return providerRepository.save(provider);
    }

    @PutMapping("/providers/{id}")
    public Provider updateProvider(@PathVariable Long id, @RequestBody Provider details) {
        Provider provider = providerRepository.findById(id).orElseThrow();
        provider.setProviderName(details.getProviderName());
        provider.setContactDetails(details.getContactDetails());
        return providerRepository.save(provider);
    }

    @DeleteMapping("/providers/{id}")
    public ResponseEntity<?> deleteProvider(@PathVariable Long id) {
        providerRepository.deleteById(id);
        return ResponseEntity.ok().body("Provider removed!");
    }

    // ==========================================
    // SECTION: VEHICLE CONTRACT (FLEET) MANAGEMENT
    // ==========================================

    @GetMapping("/vehicles")
    public List<VehicleContract> getAllContracts() {
        return contractRepository.findAll();
    }

    @PostMapping("/vehicles")
    public VehicleContract addContract(@RequestBody VehicleContract contract) {
        return contractRepository.save(contract);
    }

    @PutMapping("/vehicles/{id}")
    public VehicleContract updateContract(@PathVariable Long id, @RequestBody VehicleContract details) {
        VehicleContract contract = contractRepository.findById(id).orElseThrow();
        contract.setVehicleType(details.getVehicleType());
        contract.setBaseRatePerDay(details.getBaseRatePerDay());
        contract.setAvailabilityStatus(details.isAvailabilityStatus());
        return contractRepository.save(contract);
    }

    @PatchMapping("/vehicles/{id}/status")
    public ResponseEntity<?> updateVehicleStatus(@PathVariable Long id, @RequestBody Map<String, String> statusMap) {
        VehicleContract contract = contractRepository.findById(id).orElseThrow();

        String newStatus = statusMap.get("status");
        if ("AVAILABLE".equalsIgnoreCase(newStatus)) {
            contract.setAvailabilityStatus(true);
        } else {
            contract.setAvailabilityStatus(false);
        }

        contractRepository.save(contract);
        return ResponseEntity.ok().body("Status Updated Successfully!");
    }

    @DeleteMapping("/vehicles/{id}")
    public ResponseEntity<?> deleteContract(@PathVariable Long id) {
        contractRepository.deleteById(id);
        return ResponseEntity.ok().body("Vehicle removed!");
    }

    // ==========================================
    // SECTION: FULL USER MANAGEMENT
    // ==========================================

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // 🔥 ADDED: Update User Role from React Dropdown
    @PatchMapping("/users/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable Long id, @RequestBody Map<String, String> roleMap) {
        try {
            User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
            String newRoleStr = roleMap.get("role");

            // Map string to Enum
            User.Role newRole = User.Role.valueOf(newRoleStr.toUpperCase());
            user.setRole(newRole);

            userRepository.save(user);
            return ResponseEntity.ok().body("User role updated successfully to " + newRole);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to update user role.");
        }
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            if (!userRepository.existsById(id)) {
                return ResponseEntity.status(404).body("User not found");
            }
            userRepository.deleteById(id);
            return ResponseEntity.ok().body("User account deleted successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Deletion Forbidden: User has active bookings or requests.");
        }
    }

    @GetMapping("/list-admins")
    public List<User> getAllAdmins() {
        return userRepository.findByRole(User.Role.ADMIN);
    }
}