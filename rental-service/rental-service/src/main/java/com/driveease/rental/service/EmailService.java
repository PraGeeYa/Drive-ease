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
 * EmailService is responsible for processing HTML templates and sending
 * personalized emails to customers.
 */
@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private TemplateEngine templateEngine; // Thymeleaf logic එක handle කරන්නේ මෙයා

    /**
     * Sends a rich HTML booking confirmation email.
     * @param toEmail Customer's email address
     * @param name Customer's name
     * @param car Vehicle model
     * @param date Pickup date
     * @param price Final rental price
     */
    public void sendBookingConfirmation(String toEmail, String name, String car, String date, String price) {
        try {
            // 1. Create a MimeMessage for HTML content
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            // 2. Set Email Metadata
            helper.setTo(toEmail);
            helper.setSubject("Your DriveEase Booking is Confirmed! ✅");

            // 3. Prepare data for the HTML template (Context)
            Context context = new Context();
            context.setVariable("customerName", name);
            context.setVariable("vehicle", car);
            context.setVariable("date", date);
            context.setVariable("price", price);

            // 4. Generate the final HTML by merging Template + Data
            // "booking-confirmation" refers to booking-confirmation.html in resources/templates
            String htmlContent = templateEngine.process("booking-confirmation", context);

            // 5. Set the message text as HTML
            helper.setText(htmlContent, true);

            // 6. Send the Email
            mailSender.send(message);
            System.out.println("Sent Email " + toEmail);

        } catch (MessagingException e) {
            System.err.println("Didn't sent " + e.getMessage());
        }
    }
}