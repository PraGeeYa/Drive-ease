import apiClient from '../apiClient';

/**
 * DriveEase Elite - Admin Management Service
 * Developed by Prageeth Weerasekara
 * Redefined for professional vehicle and user management.
 */
const AdminService = {
    
    // 1. Dashboard Metrics & Data Sync
    getDashboardData: () => {
        return Promise.all([
            apiClient.get('/bookings/all'),
            apiClient.get('/admin/users'),
            apiClient.get('/admin/contracts'),
            apiClient.get('/admin/providers')
        ]);
    },

    // 2. Analytical Reports
    getReportStats: () => {
        return apiClient.get('/admin/reports/summary');
    },

    // 3. Inventory (Contracts) Management
    uploadContract: (payload) => {
        return apiClient.post('/admin/contracts', payload);
    },
    
    updateContract: (id, payload) => {
        if (!id) throw new Error("Contract ID is required.");
        return apiClient.put(`/admin/contracts/${id}`, payload);
    },

    updateContractStatus: (id, status) => {
        if (!id) throw new Error("Contract ID is required for status update.");
        return apiClient.put(`/vehicles/${id}/status?status=${status}`);
    },

    toggleContractStatus: (id, status) => {
        return apiClient.put(`/vehicles/${id}/status?status=${status}`);
    },

    // 4. Provider Management
    // Registers a new vehicle provider into the system database.
    addProvider: (providerData) => {
        return apiClient.post('/admin/providers', providerData);
    },

    /**
     * UPDATED: updateProvider
     * Modifies existing provider details (Name, Contact, Address, etc.) 
     * based on the unique providerId.
     */
    updateProvider: (id, providerData) => {
        if (!id) throw new Error("Provider ID is required for update.");
        return apiClient.put(`/admin/providers/${id}`, providerData);
    },

    /**
     * UPDATED: deleteProvider
     * Permanently removes a vehicle provider from the system ledger.
     */
    deleteProvider: (id) => {
        if (!id) throw new Error("Provider ID is required for deletion.");
        return apiClient.delete(`/admin/providers/${id}`);
    },

    // 5. User & Access Control
    getAllUsers: () => {
        return apiClient.get('/admin/users');
    },

    deleteUser: (id) => {
        if (!id) throw new Error("Target ID is required for deletion.");
        return apiClient.delete(`/admin/users/${id}`);
    },

    // 6. Booking Management
    updateBooking: (id, payload) => {
        if (!id) throw new Error("Booking ID is required for update.");
        return apiClient.put(`/bookings/${id}`, payload);
    },

    deleteBooking: (id) => {
        if (!id) throw new Error("Booking ID is required for deletion.");
        return apiClient.delete(`/bookings/${id}`);
    },

    // 7. Inquiries & Communication
    getContactMessages: () => {
        return apiClient.get('/contact/all'); 
    },

    // 8. Security & Admin Authorization
    registerAdmin: (adminData) => {
        return apiClient.post('/auth/signup', adminData); 
    },

    updateAdmin: (id, adminData) => {
        if (!id) throw new Error("Admin ID is required.");
        return apiClient.put(`/admin/users/${id}`, adminData);
    },

    getAllAdmins: () => {
        return apiClient.get('/admin/list-admins');
    }
};

export default AdminService;