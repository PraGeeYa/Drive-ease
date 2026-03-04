import apiClient from '../apiClient';

/**
 * BookingService - Manages all vehicle reservation and inquiry flows.
 * This service handles how users find vehicles and how those searches 
 * turn into actual bookings or requests.
 */
const BookingService = {
    // 1. Search vehicles based on specific criteria like type, duration, and quantity.
    // Params: e.g., { type: 'SUV', days: 5, count: 1 }
    // This helps users filter the fleet before making a choice.
    searchVehicles: (params) => {
        return apiClient.get('/bookings/search', { params });
    },

    // 2. Creates a confirmed booking record directly in the system.
    // This logic is primarily used by Support Agents to finalize a customer's deal.
    // Fixed the previous 404 Error; backend mapping is now fully functional.
    createBooking: (bookingData) => {
        return apiClient.post('/bookings/create', bookingData);
    },

    // 3. Submits a formal booking request from a Customer to the system.
    // This is used when a Customer picks a car and needs an Agent to verify it.
    sendRequest: (requestData) => {
        return apiClient.post('/bookings/request', requestData);
    },

    // 4. Retrieves a list of pending booking requests assigned to a specific Agent.
    // This allows Agents to see their "To-Do" list of customer inquiries.
    getAgentRequests: (agentId) => {
        return apiClient.get(`/bookings/requests/agent/${agentId}`);
    },

    // 5. Fetches every booking record stored in the database.
    // Mainly used for Admin Dashboard statistics to monitor business performance.
    getAllBookings: () => {
        return apiClient.get('/bookings/all');
    }
};

export default BookingService;