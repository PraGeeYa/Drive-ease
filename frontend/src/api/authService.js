import apiClient from './axiosConfig';

export const authService = {
    
    registerUser: async (userData) => {
        try {
            // Path: /api/auth/signup (AuthController eke hatiyata)
            const response = await apiClient.post('/auth/signup', userData);
            return response;
        } catch (error) {
            console.error("Registration Error:", error);
            throw error; 
        }
    },

    loginUser: async (credentials) => {
        try {
            // Path: /api/auth/login
            const response = await apiClient.post('/auth/login', credentials);
            
            if (response.data && response.data.token) {
                localStorage.setItem('token', response.data.token);
                
                // User ID eka save karagannawa
                if (response.data.userId) {
                    localStorage.setItem('userId', response.data.userId);
                }

                // User Role (AGENT/CUSTOMER) save karagannawa
                if (response.data.role) {
                    localStorage.setItem('userRole', response.data.role);
                }
            }
            return response;
        } catch (error) {
            throw error;
        }
    },

    // --- Dropdown ekata Agents la ganna path eka update kala ---
    getAllAgents: async () => {
        try {
            // path: /api/auth/agents (AuthController eke thiyena widiyata)
            const response = await apiClient.get('/auth/agents'); 
            return response.data;
        } catch (error) {
            console.error("Error fetching agents:", error);
            throw error;
        }
    },

    logoutUser: () => {
        localStorage.clear(); 
    },

    isAuthenticated: () => !!localStorage.getItem('token'),
    getUserRole: () => localStorage.getItem('userRole'),
    getUserId: () => localStorage.getItem('userId')
};