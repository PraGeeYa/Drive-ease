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

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    @Autowired
    private VehicleContractRepository contractRepository;

    @Autowired
    private ProviderRepository providerRepository;

    @Autowired
    private UserRepository userRepository;

    // PROVIDER MANAGEMENT
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
        return ResponseEntity.ok("Provider removed!");
    }

    // VEHICLE CONTRACT MANAGEMENT
    @GetMapping("/contracts")
    public List<VehicleContract> getAllContracts() {
        return contractRepository.findAll();
    }

    @PostMapping("/contracts")
    public VehicleContract addContract(@RequestBody VehicleContract contract) {
        return contractRepository.save(contract);
    }

    @PutMapping("/contracts/{id}")
    public VehicleContract updateContract(@PathVariable Long id, @RequestBody VehicleContract details) {
        VehicleContract contract = contractRepository.findById(id).orElseThrow();
        contract.setVehicleType(details.getVehicleType());
        contract.setBaseRatePerDay(details.getBaseRatePerDay());
        contract.setAvailabilityStatus(details.isAvailabilityStatus());
        return contractRepository.save(contract);
    }

    @DeleteMapping("/contracts/{id}")
    public ResponseEntity<?> deleteContract(@PathVariable Long id) {
        contractRepository.deleteById(id);
        return ResponseEntity.ok("Vehicle removed!");
    }

    // FULL USER MANAGEMENT
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            if (!userRepository.existsById(id)) {
                return ResponseEntity.status(404).body("User not found");
            }
            // User-wa delete karanna kalin eyaage links check wenawa
            userRepository.deleteById(id);
            return ResponseEntity.ok("User account deleted successfully!");
        } catch (Exception e) {
            // Salli saha booking data thibboth delete karanna baha
            return ResponseEntity.status(500).body("Deletion Forbidden: User has active bookings or requests.");
        }
    }

    @GetMapping("/list-admins")
    public List<User> getAllAdmins() {
        return userRepository.findByRole(User.Role.ADMIN);
    }
}