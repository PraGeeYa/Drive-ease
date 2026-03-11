package com.driveease.rental.controller;

import com.driveease.rental.model.Booking;
import com.driveease.rental.repository.BookingRepository;
import com.driveease.rental.service.PdfService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * BookingPdfController - Handles PDF generation for booking receipts.
 * It streams a PDF file directly to the client's browser.
 */
@RestController
// Matches the path permitted in SecurityConfig
@RequestMapping("/api/booking-requests/receipt")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"}, allowedHeaders = "*", exposedHeaders = "Content-Disposition")
public class BookingPdfController {

    @Autowired
    private PdfService pdfService;

    @Autowired
    private BookingRepository bookingRepository;

    /**
     * GET: GENERATE RECEIPT
     * Fetches booking data and exports it as a downloadable PDF.
     * @param id - The ID of the booking request.
     * @param response - The HttpServletResponse to write the PDF stream into.
     */
    @GetMapping("/{id}")
    public void generateReceipt(@PathVariable Long id, HttpServletResponse response) throws IOException {
        try {
            // Step 1: Check if the booking exists in the database
            Booking booking = bookingRepository.findById(id).orElse(null);

            if (booking == null) {
                // Return 404 if booking ID is invalid
                response.sendError(HttpServletResponse.SC_NOT_FOUND, "Booking reference not found.");
                return;
            }

            // Step 2: Configure Response Headers for PDF delivery
            response.setContentType("application/pdf");

            // Header to force download (attachment) or view in browser (inline)
            String headerKey = "Content-Disposition";
            String headerValue = "attachment; filename=DriveEase_Invoice_" + id + ".pdf";
            response.setHeader(headerKey, headerValue);

            // Step 3: Use PdfService to generate and write the PDF to the response output stream
            pdfService.export(response, booking);

        } catch (Exception e) {
            // Handle generation errors and send a 500 status code
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error generating PDF: " + e.getMessage());
        }
    }
}