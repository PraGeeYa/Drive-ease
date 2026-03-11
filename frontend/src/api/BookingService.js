import apiClient from './axiosConfig';

const BookingService = {
    
    // 1. Available Vehicles search karanawa
    getAvailableVehicles: async () => {
        try {
            // Path: /api/bookings/search
            const response = await apiClient.get('/bookings/search'); 
            return response.data;
        } catch (error) {
            console.error("Error fetching vehicles:", error);
            throw error;
        }
    },

    // 2. Customer Inquiry Request (sendRequest)
    sendBookingInquiry: async (inquiryData) => {
        try {
            // Path: /api/booking-requests/send
            const response = await apiClient.post('/booking-requests/send', inquiryData); 
            return response.data;
        } catch (error) {
            console.error("Error sending inquiry:", error);
            throw error;
        }
    },

    // 3. Agent ge Confirmed Bookings tika
    getAgentBookings: async (agentId) => {
        try {
            // Path: /api/bookings/agent/{agentId}
            const response = await apiClient.get(`/bookings/agent/${agentId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching agent bookings:", error);
            throw error;
        }
    },

    // 4. Agent ta labunu Inquiries (Pending Requests)
    getAgentRequests: async (agentId) => {
        try {
            // Path: /api/booking-requests/agent/{agentId}
            const response = await apiClient.get(`/booking-requests/agent/${agentId}`); 
            return response.data;
        } catch (error) {
            console.error("Error fetching inquiries:", error);
            throw error;
        }
    },

    // 5. Update & Delete
    updateBooking: async (id, bookingData) => {
        try {
            const response = await apiClient.put(`/bookings/${id}`, bookingData);
            return response.data;
        } catch (error) {
            console.error("Error updating booking:", error);
            throw error;
        }
    },

    deleteBooking: async (id) => {
        try {
            const response = await apiClient.delete(`/bookings/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error deleting record:", error);
            throw error;
        }
    }
};

export default BookingService;