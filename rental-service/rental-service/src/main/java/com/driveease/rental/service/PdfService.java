package com.driveease.rental.service;

import com.driveease.rental.model.Booking;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.awt.Color;
import java.time.LocalDate;

/**
 * PdfService - Generates a professional PDF receipt for vehicle bookings.
 * This service handles layout, styling, and streaming the file to the client.
 */
@Service
public class PdfService {

    // IMPORTANT: Ensure this path is correct and accessible by the application.
    // Use forward slashes (/) or double backslashes (\\) in Java paths.
    private static final String LOGO_PATH = "D:\\New\\rental-service\\rental-service\\src\\main\\resources\\static\\logo.png";

    public void export(HttpServletResponse response, Booking booking) throws IOException {
        // Create an A4 Document
        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, response.getOutputStream());

        document.open();

        // DriveEase Brand Colors
        Color themeBlue = new Color(0, 41, 255);

        // --- 1. HEADER SECTION (Logo & Company Branding) ---
        PdfPTable headerTable = new PdfPTable(2);
        headerTable.setWidthPercentage(100);
        headerTable.setWidths(new float[]{1.2f, 3.8f});

        try {
            // Load the logo image from the specified file path
            Image logo = Image.getInstance(LOGO_PATH);
            logo.scaleToFit(65, 65);

            PdfPCell logoCell = new PdfPCell(logo);
            logoCell.setBorder(Rectangle.NO_BORDER);
            logoCell.setPaddingBottom(15);
            headerTable.addCell(logoCell);
        } catch (Exception e) {
            // Log error if the logo file is not found or path is wrong
            System.err.println("PDF Logo Load Error: " + e.getMessage());
            PdfPCell emptyCell = new PdfPCell();
            emptyCell.setBorder(Rectangle.NO_BORDER);
            headerTable.addCell(emptyCell);
        }

        // Company Details (Title and Address)
        Font companyFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 22, themeBlue);
        Paragraph details = new Paragraph("DRIVEEASE ELITE", companyFont);
        details.add(new Chunk("\nPremium Vehicle Management Ecosystem", FontFactory.getFont(FontFactory.HELVETICA, 10, Color.GRAY)));
        details.add(new Chunk("\nNo. 450 Elite Plaza, Colombo 03, Sri Lanka", FontFactory.getFont(FontFactory.HELVETICA, 9, Color.GRAY)));

        PdfPCell detailsCell = new PdfPCell(details);
        detailsCell.setBorder(Rectangle.NO_BORDER);
        detailsCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        detailsCell.setPaddingLeft(10);
        headerTable.addCell(detailsCell);

        document.add(headerTable);
        document.add(new Paragraph("\n"));

        // --- 2. DOCUMENT TITLE AND DATE ---
        PdfPTable infoTable = new PdfPTable(2);
        infoTable.setWidthPercentage(100);

        PdfPCell titleCell = new PdfPCell(new Phrase("OFFICIAL RENTAL RECEIPT", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14)));
        titleCell.setBorder(Rectangle.NO_BORDER);
        infoTable.addCell(titleCell);

        PdfPCell dateCell = new PdfPCell(new Phrase("Date: " + LocalDate.now(), FontFactory.getFont(FontFactory.HELVETICA, 10)));
        dateCell.setBorder(Rectangle.NO_BORDER);
        dateCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        infoTable.addCell(dateCell);

        document.add(infoTable);
        document.add(new Paragraph("\n"));

        // --- 3. BOOKING DETAILS TABLE ---
        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);

        // Helper method calls to add styled rows
        addStyledRow(table, "Reference Number", "#DE-BK-00" + booking.getBookingId());
        addStyledRow(table, "Client Name", booking.getCustomerName());

        String vehicle = (booking.getVehicleContract() != null) ? booking.getVehicleContract().getVehicleType() : "Elite Fleet Vehicle";
        addStyledRow(table, "Vehicle Details", vehicle);

        // Handle potential null dates to avoid errors during PDF generation
        String pickupDate = (booking.getPickupDate() != null) ? booking.getPickupDate().toString() : "To be confirmed";
        addStyledRow(table, "Pickup Date", pickupDate);

        int rentalDays = booking.getRentalDays() > 0 ? booking.getRentalDays() : 1;
        addStyledRow(table, "Rental Duration", rentalDays + " Day(s)");

        document.add(table);

        // --- 4. TOTAL PAYMENT SUMMARY ---
        PdfPTable totalTable = new PdfPTable(1);
        totalTable.setWidthPercentage(45);
        totalTable.setHorizontalAlignment(Element.ALIGN_RIGHT);
        totalTable.setSpacingBefore(20);

        // Formatting currency to 2 decimal places with commas (e.g., 50,000.00)
        String formattedPrice = String.format("%,.2f", booking.getFinalPrice().doubleValue());
        PdfPCell totalCell = new PdfPCell(new Phrase("TOTAL PAID: LKR " + formattedPrice,
                FontFactory.getFont(FontFactory.HELVETICA_BOLD, 13, Color.WHITE)));
        totalCell.setPadding(12);
        totalCell.setBackgroundColor(themeBlue);
        totalCell.setBorder(Rectangle.NO_BORDER);
        totalCell.setHorizontalAlignment(Element.ALIGN_CENTER);
        totalTable.addCell(totalCell);

        document.add(totalTable);

        // --- 5. FOOTER (Automation Notice) ---
        Paragraph footer = new Paragraph("\n\n\nThis is an automated system generated receipt.\nThank you for choosing DriveEase Elite!",
                FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 9, Color.GRAY));
        footer.setAlignment(Element.ALIGN_CENTER);
        document.add(footer);

        // Finalize and close the document
        document.close();
    }

    /**
     * Helper method to add a stylized row to the main data table.
     * @param table - The table to add cells to.
     * @param label - The field name (Left column).
     * @param value - The actual data (Right column).
     */
    private void addStyledRow(PdfPTable table, String label, String value) {
        // Label Cell Styling
        PdfPCell cell1 = new PdfPCell(new Phrase(label, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, Color.DARK_GRAY)));
        cell1.setPadding(12);
        cell1.setBackgroundColor(new Color(245, 247, 250)); // Light Grey background
        cell1.setBorderColor(new Color(226, 232, 240));
        table.addCell(cell1);

        // Value Cell Styling
        PdfPCell cell2 = new PdfPCell(new Phrase(value != null ? value : "N/A", FontFactory.getFont(FontFactory.HELVETICA, 10)));
        cell2.setPadding(12);
        cell2.setBorderColor(new Color(226, 232, 240));
        table.addCell(cell2);
    }
}