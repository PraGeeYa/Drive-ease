// File Path: src/api/Services/ContactService.js
import apiClient from '../apiClient';

/**
 * ContactService - Manages user inquiries and support communications.
 * This service handles sending messages from the "Contact Us" form to the database.
 */
const ContactService = {
    /**
     * Sends a customer inquiry or support message to the backend server.
     * @param {Object} formData - Contains user input: firstName, lastName, email, subject, and message.
     * The backend will process this data, usually storing it for Admin review.
     */
    sendMessage: (formData) => {
        return apiClient.post('/contact/send', formData);
    }
};

export default ContactService;