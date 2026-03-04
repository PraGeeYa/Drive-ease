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

/**
 * AdminController - Handles all administrative actions for managing the system.
 * This includes managing vehicle suppliers (Providers), the Fleet (Contracts), and Users.
 */
@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000") // Allows React frontend to communicate with these endpoints
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

    // Fetches all vehicle suppliers registered in the system
    @GetMapping("/providers")
    public List<Provider> getAllProviders() {
        return providerRepository.findAll();
    }

    // Registers a new third-party vehicle provider
    @PostMapping("/providers")
    public Provider addProvider(@RequestBody Provider provider) {
        return providerRepository.save(provider);
    }

    // Updates an existing provider's details (Name or Contact)
    @PutMapping("/providers/{id}")
    public Provider updateProvider(@PathVariable Long id, @RequestBody Provider details) {
        Provider provider = providerRepository.findById(id).orElseThrow();
        provider.setProviderName(details.getProviderName());
        provider.setContactDetails(details.getContactDetails());
        return providerRepository.save(provider);
    }

    // Removes a provider from the database
    @DeleteMapping("/providers/{id}")
    public ResponseEntity<?> deleteProvider(@PathVariable Long id) {
        providerRepository.deleteById(id);
        return ResponseEntity.ok("Provider removed!");
    }

    // ==========================================
    // SECTION: VEHICLE CONTRACT (FLEET) MANAGEMENT
    // ==========================================

    // Retrieves all vehicle entries available in the fleet inventory
    @GetMapping("/contracts")
    public List<VehicleContract> getAllContracts() {
        return contractRepository.findAll();
    }

    // Adds a new vehicle type/model to the inventory
    @PostMapping("/contracts")
    public VehicleContract addContract(@RequestBody VehicleContract contract) {
        return contractRepository.save(contract);
    }

    // Modifies existing vehicle data like daily rates or availability
    @PutMapping("/contracts/{id}")
    public VehicleContract updateContract(@PathVariable Long id, @RequestBody VehicleContract details) {
        VehicleContract contract = contractRepository.findById(id).orElseThrow();
        contract.setVehicleType(details.getVehicleType());
        contract.setBaseRatePerDay(details.getBaseRatePerDay());
        contract.setAvailabilityStatus(details.isAvailabilityStatus());
        return contractRepository.save(contract);
    }

    // Deletes a specific vehicle entry from the fleet
    @DeleteMapping("/contracts/{id}")
    public ResponseEntity<?> deleteContract(@PathVariable Long id) {
        contractRepository.deleteById(id);
        return ResponseEntity.ok("Vehicle removed!");
    }

    // ==========================================
    // SECTION: FULL USER MANAGEMENT
    // ==========================================

    // Fetches a complete list of all users (Admins, Agents, and Customers)
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    /**
     * DELETE USER
     * Safely attempts to remove a user account.
     * Prevents deletion if the user is linked to active transactions to maintain data integrity.
     */
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            if (!userRepository.existsById(id)) {
                return ResponseEntity.status(404).body("User not found");
            }
            // Deletes user; will fail if foreign key constraints (bookings/requests) exist
            userRepository.deleteById(id);
            return ResponseEntity.ok("User account deleted successfully!");
        } catch (Exception e) {
            // Returns a detailed error if the user has active business records
            return ResponseEntity.status(500).body("Deletion Forbidden: User has active bookings or requests.");
        }
    }

    // Filters and fetches only the administrative users
    @GetMapping("/list-admins")
    public List<User> getAllAdmins() {
        return userRepository.findByRole(User.Role.ADMIN);
    }
}