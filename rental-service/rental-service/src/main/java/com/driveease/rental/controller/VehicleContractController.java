package com.driveease.rental.controller;

import com.driveease.rental.model.VehicleContract;
import com.driveease.rental.repository.VehicleContractRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/vehicles")
@CrossOrigin(origins = "http://localhost:3000")
public class VehicleContractController {

    @Autowired
    private VehicleContractRepository vehicleContractRepository;

    @GetMapping("/available")
    public List<VehicleContract> getAvailableVehicles() {
        return vehicleContractRepository.findAll().stream()
                // 🔥 FIX: boolean field එකක් නිසා කෙලින්ම v.getAvailabilityStatus() විතරක් දාන්න
                // කලින් තිබ්බ '== 1' කෑල්ල අයින් කරන්න
                .filter(v -> v.getAvailabilityStatus())
                .collect(Collectors.toList());
    }

    @PostMapping("/add")
    public VehicleContract addVehicle(@RequestBody VehicleContract vehicle) {
        return vehicleContractRepository.save(vehicle);
    }
}