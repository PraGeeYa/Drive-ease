package com.driveease.rental.controller;

import com.driveease.rental.repository.BookingRepository;
import com.driveease.rental.repository.VehicleContractRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.*;

/**
 * AdminReportController provides high-level analytics and summary data
 * for the Admin Dashboard, typically used for rendering charts and stat cards.
 */
@RestController
@RequestMapping("/api/admin/reports")
@CrossOrigin(origins = "http://localhost:3000") // Enabling CORS to allow React Frontend integration
public class AdminReportController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private VehicleContractRepository vehicleContractRepository;

    /**
     * Fetches a summarized report of the entire system performance.
     * This data includes revenue, booking volume, and fleet distribution.
     * * @return A map containing revenue metrics, booking counts, and vehicle statistics.
     */
    @GetMapping("/summary")
    public Map<String, Object> getAdminSummary() {
        Map<String, Object> report = new HashMap<>();

        // 1. ANALYZING TOTAL REVENUE
        // Calculates the sum of all 'finalPrice' columns from the booking table.
        // If no bookings exist, it defaults to 0 to prevent null errors in frontend.
        BigDecimal totalRevenue = bookingRepository.getTotalRevenue();
        report.put("totalRevenue", totalRevenue != null ? totalRevenue : 0);

        // 2. CALCULATING TOTAL BOOKING VOLUME
        // Returns the total count of confirmed booking records in the system.
        Long totalBookings = bookingRepository.getTotalBookingCount();
        report.put("totalBookings", totalBookings != null ? totalBookings : 0);

        // 3. GENERATING VEHICLE DISTRIBUTION STATS (FOR CHARTS)
        // Fetches a grouped list of vehicle types and their counts (e.g., SUV: 5, Sedan: 8).
        // Note: This relies on a custom @Query in the VehicleContractRepository.
        List<Object[]> vehicleStats = vehicleContractRepository.getVehicleTypeStats();
        report.put("vehicleStats", vehicleStats);

        return report;
    }
}