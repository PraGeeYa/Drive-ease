import apiClient from '../apiClient';

/**
 * CustomerService handles all customer-facing API interactions
 */
const CustomerService = {
    // 1. Fetch all support agents
    getSupportAgents: () => {
        return apiClient.get('/auth/agents');
    },

    // 2. Search vehicles - API ekata empty parameters giyahama 
    // backend eken okkoma vehicles ena widiyata hadala thiyෙnna ona.
    searchVehicles: (params) => {
        // Params nathnam default values set karamu error eka nawaththanna
        const defaultParams = {
            type: params?.type || '', 
            days: params?.days || 1,
            count: params?.count || 1
        };
        return apiClient.get('/bookings/search', { params: defaultParams });
    },

    // 3. New booking request
    sendBookingRequest: (requestData) => {
        return apiClient.post('/bookings/request', requestData);
    },

    // 4. Fetch customer's own requests
    getMyRequests: (customerId) => {
        return apiClient.get(`/bookings/requests/customer/${customerId}`);
    },

    // 5. Aluthin hadamu: Fetch all vehicles without filters (Optional)
    // Backend eke mehema ekak thiyenawa nam meka thama Fleet page ekata hodama.
    getAllVehicles: () => {
        return apiClient.get('/bookings/all-vehicles'); 
    }
};

export default CustomerService;