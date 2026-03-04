package com.driveease.rental.controller;

import com.driveease.rental.model.Booking;
import com.driveease.rental.repository.BookingRepository;
import com.driveease.rental.service.PdfService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

@RestController
@RequestMapping("/api/bookings/receipt")
@CrossOrigin(origins = "http://localhost:3000")
public class BookingPdfController {

    @Autowired
    private PdfService pdfService;

    @Autowired
    private BookingRepository bookingRepository;

    @GetMapping("/{id}")
    public void generateReceipt(@PathVariable Long id, HttpServletResponse response) throws IOException {
        response.setContentType("application/pdf");

        String headerKey = "Content-Disposition";
        String headerValue = "attachment; filename=DriveEase_Receipt_" + id + ".pdf";
        response.setHeader(headerKey, headerValue);

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        pdfService.export(response, booking);
    }
}