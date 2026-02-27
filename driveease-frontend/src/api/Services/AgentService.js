import apiClient from '../apiClient';

/**
 * AgentService handles all API calls related to 
 * Agent requests and confirmed booking records.
 */
const AgentService = {
    // 1. Fetch all PENDING requests assigned to a specific agent (From booking_request table)
    getRequestsByAgent: (agentId) => {
        return apiClient.get(`/bookings/requests/agent/${agentId}`);
    },

    // 2. Confirm/Approve a pending booking request
    confirmBooking: (payload) => {
        return apiClient.post('/bookings/confirm', payload);
    },

    // 3. Reject/Delete a booking request
    rejectRequest: (requestId) => {
        return apiClient.delete(`/admin/bookings/requests/${requestId}`);
    },

    // --- ALUTHIN UPDATE KALA (Confirmed Booking Records) ---

    // 4. FIX: Agent karapu confirmed bookings tika ganna (From booking table)
    // Meken thama oyaa kiyapu booking_id, customer_name tika enne.
    getAgentBookings: (agentId) => {
        return apiClient.get(`/bookings/agent/${agentId}`);
    },

    // 5. Booking ekak update karanna (Onnam witarak)
    updateBooking: (id, payload) => {
        return apiClient.put(`/bookings/${id}`, payload);
    },

    // 6. Booking record ekak delete karanna
    deleteBooking: (id) => {
        return apiClient.delete(`/bookings/${id}`);
    }
};

export default AgentService;