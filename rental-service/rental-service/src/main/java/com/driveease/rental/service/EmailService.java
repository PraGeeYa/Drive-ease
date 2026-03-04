package com.driveease.rental.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

/**
 * EmailService - Handles automated HTML email notifications.
 * This service merges dynamic booking data with Thymeleaf templates
 * to send professional confirmation emails to customers.
 */
@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private TemplateEngine templateEngine; // Responsible for processing Thymeleaf HTML templates

    /**
     * SEND BOOKING CONFIRMATION
     * Generates and dispatches a rich HTML email once a booking is approved.
     * * @param toEmail - The recipient's email address.
     * @param name    - The customer's display name.
     * @param car     - The vehicle model/type being rented.
     * @param date    - The scheduled pickup date.
     * @param price   - The total final price of the rental.
     */
    public void sendBookingConfirmation(String toEmail, String name, String car, String date, String price) {
        try {
            // 1. MIME MESSAGE CREATION: Required for sending HTML/Multipart emails
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            // 2. EMAIL METADATA: Setting the recipient and a professional subject line
            helper.setTo(toEmail);
            helper.setSubject("Your DriveEase Booking is Confirmed! ✅");

            // 3. DATA BINDING (THYMELEAF CONTEXT):
            // We pass the Java variables into the 'Context' so the HTML template can see them.
            Context context = new Context();
            context.setVariable("customerName", name);
            context.setVariable("vehicle", car);
            context.setVariable("date", date);
            context.setVariable("price", price);

            // 4. TEMPLATE PROCESSING:
            // Merges the 'booking-confirmation.html' (from resources/templates) with the data.
            String htmlContent = templateEngine.process("booking-confirmation", context);

            // 5. HTML CONTENT SETTING:
            // The 'true' flag ensures Spring treats the string as HTML, not plain text.
            helper.setText(htmlContent, true);

            // 6. DISPATCH: Sending the final rendered email through the configured SMTP server
            mailSender.send(message);
            System.out.println("Confirmation Email successfully sent to: " + toEmail);

        } catch (MessagingException e) {
            // Error handling for SMTP connection issues or template rendering failures
            System.err.println("Failed to send email to " + toEmail + " | Error: " + e.getMessage());
        }
    }
}