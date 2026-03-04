import apiClient from '../apiClient';

/**
 * AuthService - Manages security and user-related operations.
 * This service acts as the gateway for users to enter the system and for 
 * admins to monitor user accounts.
 */
const AuthService = {
    // 1. User login: sends username and password to the backend for verification.
    // If successful, the server usually returns a token or user ID to start a session.
    login: (credentials) => {
        return apiClient.post('/auth/login', credentials);
    },

    // 2. New user registration: Creates a new account in the system database.
    // This is used for both regular Customers and Support Agents.
    signup: (userData) => {
        return apiClient.post('/auth/signup', userData);
    },

    // 3. Fetch all support agents: Retrieves a list of active agents from the database.
    // Primarily used in the CustomerView so users can select a handler for their bookings.
    getAgents: () => {
        return apiClient.get('/auth/agents');
    },

    // 4. Admin view of all users: Retrieves the full list of registered users.
    // Used in the AdminDashboard to manage or monitor all system accounts (Customers/Agents).
    getAllUsers: () => {
        return apiClient.get('/auth/users');
    }
};

export default AuthService;