package com.driveease.rental.controller;

import com.driveease.rental.model.VehicleContract;
import com.driveease.rental.repository.VehicleContractRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * VehicleContractController - Manages the vehicle fleet inventory.
 */
@RestController
@RequestMapping("/api/vehicles")
@CrossOrigin(origins = "http://localhost:3000")
public class VehicleContractController {

    @Autowired
    private VehicleContractRepository vehicleContractRepository;

    /**
     * FETCH AVAILABLE VEHICLES
     * Filters the fleet to return only vehicles where availabilityStatus is true.
     */
    @GetMapping("/available")
    public List<VehicleContract> getAvailableVehicles() {
        return vehicleContractRepository.findAll().stream()
                .filter(v -> v.getAvailabilityStatus())
                .collect(Collectors.toList());
    }

    /**
     * REGISTER NEW VEHICLE
     * Saves a new vehicle contract into the database ledger.
     */
    @PostMapping("/add")
    public VehicleContract addVehicle(@RequestBody VehicleContract vehicle) {
        return vehicleContractRepository.save(vehicle);
    }

    // ========================================================================
    // NEW ADDITION: STATUS TOGGLE ENGINE
    // ========================================================================

    /**
     * UPDATE VEHICLE AVAILABILITY STATUS
     * This method is triggered by the Admin Dashboard toggle switch.
     * It marks a vehicle as 'RENTED' (false) or 'AVAILABLE' (true).
     * * @param id - The unique ID of the vehicle contract.
     * @param status - The new boolean status to be persisted.
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateVehicleStatus(@PathVariable Long id, @RequestParam boolean status) {
        return vehicleContractRepository.findById(id)
                .map(vehicle -> {
                    vehicle.setAvailabilityStatus(status);
                    vehicleContractRepository.save(vehicle);
                    return ResponseEntity.ok("Vehicle status updated to: " + (status ? "Available" : "Rented"));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // ========================================================================
    // DELETE VEHICLE ENGINE (ADDED TO FIX THE ERROR)
    // ========================================================================

    /**
     * DELETE VEHICLE
     * Removes a vehicle from the database based on its ID.
     */
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteVehicle(@PathVariable Long id) {
        try {
            if (vehicleContractRepository.existsById(id)) {
                vehicleContractRepository.deleteById(id);
                return ResponseEntity.ok("Vehicle deleted successfully.");
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error deleting vehicle: " + e.getMessage());
        }
    }
}