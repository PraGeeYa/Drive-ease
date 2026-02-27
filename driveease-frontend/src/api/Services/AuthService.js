import apiClient from '../apiClient';

/**
 * AuthService handles user authentication, 
 * registration, and profile management for the system.
 */
const AuthService = {
    // 1. User login: sends username and password to backend
    login: (credentials) => {
        return apiClient.post('/auth/login', credentials);
    },

    // 2. New user registration: for both Customers and Agents
    signup: (userData) => {
        return apiClient.post('/auth/signup', userData);
    },

    // 3. Fetch all support agents: used in CustomerView dropdown
    getAgents: () => {
        return apiClient.get('/auth/agents');
    },

    // 4. Admin view of all users: used in AdminDashboard
    getAllUsers: () => {
        return apiClient.get('/auth/users');
    }
};

export default AuthService;