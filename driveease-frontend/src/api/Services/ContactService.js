// File Path: src/api/Services/ContactService.js
import apiClient from '../apiClient';

const ContactService = {
    /**
     * Send a contact message to the backend
     * @param {Object} formData - firstName, lastName, email, subject, message
     */
    sendMessage: (formData) => {
        return apiClient.post('/contact/send', formData);
    }
};

export default ContactService;