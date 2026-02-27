import apiClient from '../apiClient';

/**
 * BookingService handles vehicle searching, 
 * direct booking creation, and request management.
 */
const BookingService = {
    // 1. Search vehicles based on type, days and count
    // Params: { type: 'SUV', days: 5, count: 1 }
    searchVehicles: (params) => {
        return apiClient.get('/bookings/search', { params });
    },

    // 2. Create a new booking directly (Support Agent logic)
    // 404 Error eka fix kala backend eken, dan meka supiriyata weda
    createBooking: (bookingData) => {
        return apiClient.post('/bookings/create', bookingData);
    },

    // 3. Send a booking request (Customer request logic)
    sendRequest: (requestData) => {
        return apiClient.post('/bookings/request', requestData);
    },

    // 4. Get requests assigned to an agent
    getAgentRequests: (agentId) => {
        return apiClient.get(`/bookings/requests/agent/${agentId}`);
    },

    // 5. Get all bookings (Admin Dashboard statistics walata)
    getAllBookings: () => {
        return apiClient.get('/bookings/all');
    }
};

export default BookingService;