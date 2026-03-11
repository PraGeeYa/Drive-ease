import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Typography, Paper, TextField, Button, Grid, Table, TableBody, 
    TableCell, TableContainer, TableHead, TableRow, IconButton, Avatar, 
    Chip, Stack, CircularProgress, Snackbar, Alert, Dialog, DialogTitle, 
    DialogContent, DialogActions, MenuItem, Container
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import FleetService from '../api/FleetService';
import { authService } from '../api/authService';

// Icons
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DateRangeIcon from '@mui/icons-material/DateRange';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';

const FleetManagement = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    // Roles Logic
    const userRole = authService.getUserRole();
    const isAdmin = userRole === 'ADMIN';
    const isAgent = userRole === 'AGENT';
    // Admin and Agent both get management privileges here
    const hasManageAccess = isAdmin || isAgent; 

    // States
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openFleetDialog, setOpenFleetDialog] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Forms Data
    const [fleetFormData, setFleetFormData] = useState({ vehicleType: '', baseRatePerDay: '' });
    const [editId, setEditId] = useState(null);

    const fetchFleet = useCallback(async () => {
        try {
            setLoading(true);
            const data = await FleetService.getAllVehicles();
            setVehicles(data || []);
        } catch (err) {
            setSnackbar({ open: true, message: "Inventory offline.", severity: "error" });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchFleet(); }, [fetchFleet]);

    // --- MANAGE ACTIONS (AGENT & ADMIN) ---
    const handleOpenFleetDialog = (vehicle = null) => {
        if (vehicle) {
            setFleetFormData({ vehicleType: vehicle.vehicleType, baseRatePerDay: vehicle.baseRatePerDay });
            // 🔥 FIXED: Use contractId if available
            setEditId(vehicle.contractId || vehicle.id); 
        } else {
            setFleetFormData({ vehicleType: '', baseRatePerDay: '' });
            setEditId(null);
        }
        setOpenFleetDialog(true);
    };

    const handleSaveFleet = async () => {
        try {
            if (editId) await FleetService.updateVehicle(editId, fleetFormData);
            else await FleetService.addVehicle(fleetFormData);
            setSnackbar({ open: true, message: "Fleet updated!", severity: "success" });
            setOpenFleetDialog(false);
            fetchFleet();
        } catch (err) { setSnackbar({ open: true, message: "Action failed.", severity: "error" }); }
    };

    const handleDelete = async (id) => {
        // 🔥 ADDED validation to prevent sending undefined ID to backend
        if (!id) {
            setSnackbar({ open: true, message: "Error: Could not find valid ID to delete.", severity: "error" });
            return;
        }

        if (window.confirm("Delete unit?")) {
            try {
                await FleetService.deleteVehicle(id);
                setSnackbar({ open: true, message: "Deleted successfully.", severity: "info" });
                fetchFleet();
            } catch (err) { setSnackbar({ open: true, message: "Failed to delete.", severity: "error" }); }
        }
    };

    return (
        <Box sx={{ display: 'flex', bgcolor: '#f4f7fa', minHeight: '100vh', pt: 12 }}>
            {/* SIDEBAR */}
            <Paper elevation={0} sx={{ width: 80, height: '100vh', position: 'fixed', left: 0, top: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4, borderRight: '1px solid #e2e8f0', bgcolor: '#fff', zIndex: 1201 }}>
                <DirectionsCarIcon sx={{ color: theme.palette.primary.main, fontSize: 32, mb: 6 }} />
                <Stack spacing={3}>
                    <IconButton sx={{ color: '#94a3b8' }} onClick={() => navigate(isAdmin ? '/admin' : '/agent-dashboard')}><DashboardIcon /></IconButton>
                    <IconButton color="primary" sx={{ bgcolor: `${theme.palette.primary.main}12` }} onClick={() => navigate('/fleet-management')}><DirectionsCarIcon /></IconButton>
                    <IconButton sx={{ color: '#94a3b8' }} onClick={() => navigate('/booking-history')}><DateRangeIcon /></IconButton>
                    <IconButton sx={{ color: '#94a3b8' }}><FavoriteBorderIcon /></IconButton>
                </Stack>
                <Box sx={{ mt: 'auto' }}>
                    <IconButton sx={{ color: '#94a3b8' }} onClick={() => navigate('/settings')}><SettingsIcon /></IconButton>
                    <IconButton sx={{ color: '#ef4444' }} onClick={() => { authService.logoutUser(); navigate('/login'); }}><LogoutIcon /></IconButton>
                </Box>
            </Paper>

            <Box sx={{ flexGrow: 1, ml: '80px', p: { xs: 2, md: 5 } }}>
                <Container maxWidth="xl">
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}>
                        <Typography variant="h3" sx={{ fontWeight: 1000, color: '#1e293b' }}>
                            Fleet <span style={{ color: theme.palette.primary.main }}>Inventory</span>
                        </Typography>
                        
                        {/* 🔥 ONLY Admin can add new units */}
                        {isAdmin && (
                            <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenFleetDialog()} sx={{ borderRadius: '15px', px: 4, py: 1.8, fontWeight: 800 }}>
                                Add New Unit
                            </Button>
                        )}
                    </Box>

                    <TableContainer component={Paper} sx={{ borderRadius: '35px', boxShadow: '0 20px 50px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
                        <Table sx={{ minWidth: 1000 }}>
                            <TableHead sx={{ bgcolor: '#f8fafc' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 800, pl: 5 }}>VEHICLE UNIT</TableCell>
                                    <TableCell sx={{ fontWeight: 800 }}>CLASS</TableCell>
                                    <TableCell sx={{ fontWeight: 800 }}>DAILY RATE</TableCell>
                                    <TableCell sx={{ fontWeight: 800 }}>STATUS</TableCell>
                                    <TableCell sx={{ fontWeight: 800, pr: 5 }} align="right">ACTION</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    <TableRow><TableCell colSpan={5} align="center" sx={{ py: 15 }}><CircularProgress size={60} /></TableCell></TableRow>
                                ) : vehicles.map((car) => {
                                    // 🔥 FIXED: Get correct ID for edit and delete actions
                                    const actualId = car.contractId || car.id; 
                                    
                                    return (
                                        <TableRow key={actualId} hover>
                                            <TableCell sx={{ pl: 5 }}>
                                                <Stack direction="row" spacing={3} alignItems="center">
                                                    <Avatar 
                                                        variant="rounded" 
                                                        src={car.imageUrl || `https://source.unsplash.com/featured/?${car.vehicleType},car`} 
                                                        sx={{ width: 85, height: 85, borderRadius: '24px' }} 
                                                    />
                                                    <Typography variant="subtitle1" fontWeight={900}>{car.vehicleType} Elite</Typography>
                                                </Stack>
                                            </TableCell>
                                            <TableCell><Chip label={car.vehicleType} sx={{ fontWeight: 800 }} /></TableCell>
                                            <TableCell><Typography variant="h5" fontWeight={1000} color="primary">LKR {car.baseRatePerDay?.toLocaleString()}</Typography></TableCell>
                                            <TableCell><Chip label="AVAILABLE" color="success" sx={{ fontWeight: 900 }} /></TableCell>
                                            <TableCell align="right" sx={{ pr: 5 }}>
                                                <Stack direction="row" spacing={1} justifyContent="flex-end">
                                                    {/* Both Agent & Admin can edit/delete */}
                                                    {hasManageAccess && (
                                                        <>
                                                            <IconButton onClick={() => handleOpenFleetDialog(car)} sx={{ bgcolor: '#f1f5f9' }}><EditIcon color="primary" /></IconButton>
                                                            {/* 🔥 FIXED: Call delete with actualId */}
                                                            <IconButton onClick={() => handleDelete(actualId)} sx={{ bgcolor: '#fff1f2', color: '#e11d48' }}><DeleteIcon /></IconButton>
                                                        </>
                                                    )}
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Container>
            </Box>

            {/* FLEET MANAGEMENT DIALOG */}
            <Dialog open={openFleetDialog} onClose={() => setOpenFleetDialog(false)} PaperProps={{ sx: { borderRadius: '30px', p: 2 } }}>
                <DialogTitle sx={{ fontWeight: 900 }}>{editId ? 'Update Fleet Unit' : 'Register New Unit'}</DialogTitle>
                <DialogContent>
                    <Stack spacing={3} mt={1}>
                        <TextField select fullWidth label="Vehicle Class" value={fleetFormData.vehicleType} onChange={(e) => setFleetFormData({...fleetFormData, vehicleType: e.target.value})}>
                            <MenuItem value="Luxury">Luxury Sedan</MenuItem>
                            <MenuItem value="SUV">Premium SUV</MenuItem>
                            <MenuItem value="Van">Electric Van</MenuItem>
                        </TextField>
                        <TextField fullWidth label="Daily Rental Rate (LKR)" type="number" value={fleetFormData.baseRatePerDay} onChange={(e) => setFleetFormData({...fleetFormData, baseRatePerDay: e.target.value})} />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpenFleetDialog(false)} sx={{ fontWeight: 700, color: 'text.secondary' }}>Cancel</Button>
                    <Button onClick={handleSaveFleet} variant="contained" sx={{ borderRadius: '12px', px: 4, fontWeight: 800 }}>Save Data</Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                <Alert severity={snackbar.severity} sx={{ borderRadius: '15px', fontWeight: 700 }}>{snackbar.message}</Alert>
            </Snackbar>
        </Box>
    );
};

export default FleetManagement;