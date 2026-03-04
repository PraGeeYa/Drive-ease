package com.driveease.rental.controller;

import com.driveease.rental.repository.BookingRepository;
import com.driveease.rental.repository.VehicleContractRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.*;

/**
 * AdminReportController - The Analytics Engine of DriveEase.
 * This controller provides high-level summarized data to help Administrators
 * monitor business performance via charts, graphs, and metric cards.
 */
@RestController
@RequestMapping("/api/admin/reports")
@CrossOrigin(origins = "http://localhost:3000") // Bridge to allow the React Frontend to pull data
public class AdminReportController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private VehicleContractRepository vehicleContractRepository;

    /**
     * GET SUMMARY REPORT
     * Aggregates key business metrics into a single response object.
     * Used primarily for the main 'Admin Dashboard' overview.
     * * @return A data map containing Revenue, Booking counts, and Fleet statistics.
     */
    @GetMapping("/summary")
    public Map<String, Object> getAdminSummary() {
        Map<String, Object> report = new HashMap<>();

        // 1. ANALYZING TOTAL REVENUE
        // Calculates the gross sum of all 'finalPrice' records from the booking table.
        // Uses a safety check (null check) to ensure the frontend receives '0' if no sales exist.
        BigDecimal totalRevenue = bookingRepository.getTotalRevenue();
        report.put("totalRevenue", totalRevenue != null ? totalRevenue : BigDecimal.ZERO);

        // 2. CALCULATING TRANSACTION VOLUME
        // Counts every single confirmed booking record stored in the database.
        // This helps measure the system's usage and throughput.
        Long totalBookings = bookingRepository.getTotalBookingCount();
        report.put("totalBookings", totalBookings != null ? totalBookings : 0L);

        // 3. GENERATING FLEET COMPOSITION STATS (PIE CHART DATA)
        // Groups vehicles by their type (e.g., SUV, LUXURY, SEDAN) and returns their counts.
        // This is ideal for rendering Pie or Bar charts on the Admin interface.
        // Depends on a custom JPQL/Native @Query in the Repository.
        List<Object[]> vehicleStats = vehicleContractRepository.getVehicleTypeStats();
        report.put("vehicleStats", vehicleStats);

        return report;
    }
}