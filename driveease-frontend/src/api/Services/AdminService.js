import apiClient from '../apiClient';

/**
 * DriveEase Elite - Admin Management Service
 * Redefined for professional vehicle and user management.
 */
const AdminService = {
    
    // 1. Dashboard Metrics & Data Sync
    // Hama call ekakma parallelly fetch karanawa speed eka wadi karanna.
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
    // Aluth contract ekak database ekata upload kirima.
    uploadContract: (payload) => {
        return apiClient.post('/admin/contracts', payload);
    },
    
    // Database eke thiyena contract ekak update kirima.
    // 🔥 ID eka null nemei kiyala confirm karala thama request eka yawanne.
    updateContract: (id, payload) => {
        if (!id) throw new Error("Contract ID is required for update operation.");
        return apiClient.put(`/admin/contracts/${id}`, payload);
    },

    // Contract ekaka status eka (Active/Inactive) maru kirima.
    toggleContractStatus: (id, status) => {
        return apiClient.patch(`/admin/contracts/${id}/status?status=${status}`);
    },

    // 4. Provider Management
    addProvider: (providerData) => {
        return apiClient.post('/admin/providers', providerData);
    },

    // 5. User & Agent Control
    // Database eken user kenek sampuurnayenma ain kirima.
    deleteUser: (id) => {
        if (!id) throw new Error("Target ID is required for deletion.");
        return apiClient.delete(`/admin/users/${id}`);
    },

    // 6. Inquiries & Communication
    getContactMessages: () => {
        return apiClient.get('/contact/all'); 
    },

    // 7. Security & Admin Authorization
    // Aluth administrator kenek system ekata register kirima.
    registerAdmin: (adminData) => {
        return apiClient.post('/auth/signup', adminData); 
    },

    // Exist wena admin profile ekaka details update kirima.
    updateAdmin: (id, adminData) => {
        if (!id) throw new Error("Admin ID is required for profile modification.");
        return apiClient.put(`/admin/users/${id}`, adminData);
    },

    // System ekata access thiyena admins la pamanak fetch kirima.
    getAllAdmins: () => {
        return apiClient.get('/admin/list-admins');
    }
};

export default AdminService;