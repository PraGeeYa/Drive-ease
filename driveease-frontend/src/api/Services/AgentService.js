import apiClient from '../apiClient';

/**
 * AgentService - Developed by Prageeth Weerasekara
 * Handles business logic for support agents and communication with Spring Boot.
 */
const AgentService = {

    // 1. Retrieves all 'PENDING' booking requests assigned to a specific agent.
    getRequestsByAgent: (agentId) => {
        return apiClient.get(`/bookings/requests/agent/${agentId}`);
    },

    /**
     * 2. Finalizes a booking and TRIGGERS EMAIL.
     * UPDATED: Ensure the payload contains 'customerEmail' so the 
     * Backend EmailService knows where to send the confirmation.
     */
    confirmBooking: (payload) => {
        // Payload should now include: { requestId, customerEmail, customerName, car, date, price }
        return apiClient.post('/bookings/confirm', payload);
    },

    // 3. Removes or rejects a specific booking request.
    rejectRequest: (requestId) => {
        return apiClient.delete(`/admin/bookings/requests/${requestId}`);
    },

    // --- CONFIRMED BOOKING MANAGEMENT ---

    // 4. Fetches the complete history of confirmed bookings for an agent.
    getAgentBookings: (agentId) => {
        return apiClient.get(`/bookings/agent/${agentId}`);
    },

    // 5. Updates existing booking details.
    updateBooking: (id, payload) => {
        return apiClient.put(`/bookings/${id}`, payload);
    },

    // 6. Permanently deletes a confirmed booking record.
    deleteBooking: (id) => {
        return apiClient.delete(`/bookings/${id}`);
    }
};

export default AgentService;