import apiClient from '../apiClient';

/**
 * CustomerService - Manages all API operations for the Customer interface.
 * Provides functions for vehicle discovery and the booking request lifecycle.
 */
const CustomerService = {
    // 1. Fetch all support agents
    // Retrieves a list of active support agents from the system.
    // Used in the selection dropdown so customers can pick a personal handler.
    getSupportAgents: () => {
        return apiClient.get('/auth/agents');
    },

    // 2. Search vehicles
    // Queries the fleet based on type, duration (days), and quantity (count).
    // If parameters are empty, the backend should be configured to return the full fleet.
    searchVehicles: (params) => {
        // Sets default values to prevent API errors if params are missing.
        const defaultParams = {
            type: params?.type || '', 
            days: params?.days || 1,
            count: params?.count || 1
        };
        return apiClient.get('/bookings/search', { params: defaultParams });
    },

    // 3. New booking request
    // Submits a formal reservation inquiry for a specific vehicle.
    // This data is sent to the 'booking_request' table for agent approval.
    sendBookingRequest: (requestData) => {
        return apiClient.post('/bookings/request', requestData);
    },

    // 4. Fetch customer's own requests
    // Retrieves the history of booking requests made by a specific customer.
    // Allows the user to track the status (Pending/Approved) of their inquiries.
    getMyRequests: (customerId) => {
        return apiClient.get(`/bookings/requests/customer/${customerId}`);
    },

    // 5. Fetch all vehicles without filters (Optional Utility)
    // Directly fetches the entire vehicle inventory regardless of availability.
    // Ideal for the "Fleet" showcase page where all models are displayed.
    getAllVehicles: () => {
        return apiClient.get('/bookings/all-vehicles'); 
    }
};

export default CustomerService;