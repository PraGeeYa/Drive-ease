// src/api/FleetService.js
import apiClient from './axiosConfig';

const FleetService = {

    getAllVehicles: async () => {
        try {
            const response = await apiClient.get('/vehicles/available');
            return response.data;
        } catch (error) {
            console.error("Error fetching fleet:", error);
            throw error;
        }
    },


    addVehicle: async (vehicleData) => {
        try {
            const response = await apiClient.post('/vehicles/add', vehicleData);
            return response.data;
        } catch (error) {
            console.error("Error adding vehicle:", error);
            throw error;
        }
    },


    updateVehicle: async (id, vehicleData) => {
        try {
            const response = await apiClient.put(`/vehicles/update/${id}`, vehicleData);
            return response.data;
        } catch (error) {
            console.error("Error updating vehicle:", error);
            throw error;
        }
    },

    deleteVehicle: async (id) => {
        try {
            const response = await apiClient.delete(`/vehicles/delete/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error deleting vehicle:", error);
            throw error;
        }
    }
};

export default FleetService;