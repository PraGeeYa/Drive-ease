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
 * AdminController handles administrative operations including
 * Provider management, Vehicle Contract management, and User controls.
 */
@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000") // Allowing Frontend connection from React
public class AdminController {

    @Autowired
    private VehicleContractRepository contractRepository;

    @Autowired
    private ProviderRepository providerRepository;

    @Autowired
    private UserRepository userRepository;

    // ========================================================================
    // PROVIDER MANAGEMENT SECTION (CRUD Operations for Car Providers)
    // ========================================================================

    /**
     * Retrieves all registered car providers from the database.
     */
    @GetMapping("/providers")
    public List<Provider> getAllProviders() {
        return providerRepository.findAll();
    }

    /**
     * Adds a new car provider to the system.
     */
    @PostMapping("/providers")
    public Provider addProvider(@RequestBody Provider provider) {
        return providerRepository.save(provider);
    }

    /**
     * Updates details of an existing provider identified by ID.
     */
    @PutMapping("/providers/{id}")
    public Provider updateProvider(@PathVariable Long id, @RequestBody Provider details) {
        Provider provider = providerRepository.findById(id).orElseThrow();
        provider.setProviderName(details.getProviderName());
        provider.setContactDetails(details.getContactDetails());
        return providerRepository.save(provider);
    }

    /**
     * Removes a provider permanently from the database.
     */
    @DeleteMapping("/providers/{id}")
    public ResponseEntity<?> deleteProvider(@PathVariable Long id) {
        providerRepository.deleteById(id);
        return ResponseEntity.ok("Provider removed!");
    }

    // ========================================================================
    // VEHICLE CONTRACT MANAGEMENT SECTION (Inventory Controls)
    // ========================================================================

    /**
     * Fetches the complete list of all vehicle contracts available in the network.
     */
    @GetMapping("/contracts")
    public List<VehicleContract> getAllContracts() {
        return contractRepository.findAll();
    }

    /**
     * Filters and returns vehicle contracts assigned to a specific Agent.
     * This is useful for Agent-specific inventory views.
     */
    @GetMapping("/contracts/agent/{agentId}")
    public List<VehicleContract> getAgentContracts(@PathVariable Long agentId) {
        // Filters the inventory based on the Agent's User ID via SQL query logic
        return contractRepository.findByAgentUserId(agentId);
    }

    /**
     * Creates a new vehicle contract/listing in the inventory.
     */
    @PostMapping("/contracts")
    public VehicleContract addContract(@RequestBody VehicleContract contract) {
        return contractRepository.save(contract);
    }

    /**
     * Updates vehicle details, pricing, and availability for a specific contract.
     */
    @PutMapping("/contracts/{id}")
    public VehicleContract updateContract(@PathVariable Long id, @RequestBody VehicleContract details) {
        VehicleContract contract = contractRepository.findById(id).orElseThrow();
        contract.setVehicleType(details.getVehicleType());
        contract.setBaseRatePerDay(details.getBaseRatePerDay());
        contract.setAvailabilityStatus(details.isAvailabilityStatus());
        return contractRepository.save(contract);
    }

    /**
     * Deletes a vehicle contract listing from the inventory.
     */
    @DeleteMapping("/contracts/{id}")
    public ResponseEntity<?> deleteContract(@PathVariable Long id) {
        contractRepository.deleteById(id);
        return ResponseEntity.ok("Vehicle removed from inventory!");
    }

    /**
     * Toggles the rental status (Rent/Non-Rent) of a vehicle using a partial update.
     */
    @PatchMapping("/contracts/{id}/status")
    public ResponseEntity<?> toggleStatus(@PathVariable Long id, @RequestParam boolean status) {
        VehicleContract contract = contractRepository.findById(id).orElseThrow();
        contract.setAvailabilityStatus(status);
        contractRepository.save(contract);
        return ResponseEntity.ok("Status updated: " + (status ? "Rent" : "Non-Rent"));
    }

    // ========================================================================
    // USER & ACCESS MANAGEMENT SECTION
    // ========================================================================

    /**
     * Retrieves a list of all registered users (Customers, Agents, Admins).
     */
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    /**
     * Deletes a user account from the system.
     */
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok("User deleted successfully!");
    }

    /**
     * Specifically filters and lists only users with the 'ADMIN' role.
     */
    @GetMapping("/list-admins")
    public ResponseEntity<List<User>> getAllAdmins() {
        try {
            List<User> admins = userRepository.findByRole(User.Role.ADMIN);
            return ResponseEntity.ok(admins);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}