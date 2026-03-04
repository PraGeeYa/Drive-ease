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

@Service
public class PdfService {

    // You can replace this URL with your actual logo hosted online
    private static final String LOGO_URL = "https://cdn-icons-png.flaticon.com/512/744/744465.png";

    public void export(HttpServletResponse response, Booking booking) throws IOException {
        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, response.getOutputStream());

        document.open();

        // --- 1. LOGO & HEADER SECTION ---
        PdfPTable headerTable = new PdfPTable(2);
        headerTable.setWidthPercentage(100);
        headerTable.setWidths(new float[]{1.5f, 3.5f});

        // Add Logo
        try {
            Image logo = Image.getInstance(LOGO_URL);
            logo.scaleToFit(80, 80);
            PdfPCell logoCell = new PdfPCell(logo);
            logoCell.setBorder(Rectangle.NO_BORDER);
            headerTable.addCell(logoCell);
        } catch (Exception e) {
            headerTable.addCell(""); // Fallback if logo fails
        }

        // Add Company Name & Info
        Font companyFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 24, new Color(255, 87, 34));
        Paragraph details = new Paragraph("DRIVEEASE ELITE", companyFont);
        details.add(new Chunk("\nPremium Car Rental Services\nColombo, Sri Lanka", FontFactory.getFont(FontFactory.HELVETICA, 10, Color.GRAY)));

        PdfPCell detailsCell = new PdfPCell(details);
        detailsCell.setBorder(Rectangle.NO_BORDER);
        detailsCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        headerTable.addCell(detailsCell);

        document.add(headerTable);
        document.add(new Paragraph("\n")); // Spacing

        // --- 2. INVOICE TITLE ---
        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
        Paragraph invoiceTitle = new Paragraph("RENTAL INVOICE", titleFont);
        invoiceTitle.setAlignment(Element.ALIGN_RIGHT);
        document.add(invoiceTitle);
        document.add(new Paragraph("Date: " + LocalDate.now() + "\n\n"));

        // --- 3. BOOKING DETAILS TABLE ---
        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);
        table.setSpacingBefore(10);

        Font labelFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, Color.WHITE);

        // Helper to add styled rows
        addStyledRow(table, "Booking ID", "#DE-00" + booking.getBookingId());
        addStyledRow(table, "Customer Name", booking.getCustomerName());

        String vehicle = (booking.getVehicleContract() != null) ? booking.getVehicleContract().getVehicleType() : "Elite Vehicle";
        addStyledRow(table, "Vehicle Type", vehicle);

        addStyledRow(table, "Pickup Date", booking.getPickupDate().toString());

        LocalDate returnDate = booking.getPickupDate().plusDays(booking.getRentalDays());
        addStyledRow(table, "Return Date", returnDate.toString() + " (" + booking.getRentalDays() + " Days)");

        addStyledRow(table, "Total Vehicles", String.valueOf(booking.getVehicleCount()));

        document.add(table);

        // --- 4. TOTAL AMOUNT BOX ---
        PdfPTable totalTable = new PdfPTable(1);
        totalTable.setWidthPercentage(40);
        totalTable.setHorizontalAlignment(Element.ALIGN_RIGHT);

        PdfPCell totalCell = new PdfPCell(new Phrase("NET TOTAL: LKR " + booking.getFinalPrice(), FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14)));
        totalCell.setPadding(10);
        totalCell.setBackgroundColor(new Color(255, 243, 224));
        totalCell.setBorderColor(new Color(255, 87, 34));
        totalCell.setHorizontalAlignment(Element.ALIGN_CENTER);
        totalTable.addCell(totalCell);

        document.add(new Paragraph("\n"));
        document.add(totalTable);

        // --- 5. REQUIREMENTS ---
        if (booking.getRequirements() != null && !booking.getRequirements().isEmpty()) {
            document.add(new Paragraph("\nSpecial Notes:", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11)));
            document.add(new Paragraph(booking.getRequirements(), FontFactory.getFont(FontFactory.HELVETICA, 10)));
        }

        // --- 6. FOOTER ---
        Paragraph footer = new Paragraph("\n\n\nThank you for riding with DriveEase Elite!\nTerms & Conditions Apply.",
                FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 10, Color.GRAY));
        footer.setAlignment(Element.ALIGN_CENTER);
        document.add(footer);

        document.close();
    }

    private void addStyledRow(PdfPTable table, String label, String value) {
        PdfPCell cell1 = new PdfPCell(new Phrase(label, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11)));
        cell1.setPadding(8);
        cell1.setBackgroundColor(new Color(240, 240, 240));
        table.addCell(cell1);

        PdfPCell cell2 = new PdfPCell(new Phrase(value, FontFactory.getFont(FontFactory.HELVETICA, 11)));
        cell2.setPadding(8);
        table.addCell(cell2);
    }
}