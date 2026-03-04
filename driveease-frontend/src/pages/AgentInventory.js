import React, { useState, useEffect, useCallback } from 'react';
import { 
    Container, Typography, Paper, Box, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, IconButton, Stack, TextField, 
    Button, Snackbar, Alert, Divider, Chip, Grid, CircularProgress
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import HistoryIcon from '@mui/icons-material/History';
import AgentService from '../api/Services/AgentService';

const AgentInventory = () => {
    // --- UI COLORS & ASSETS ---
    const PRIMARY_ORANGE = "#ff5722";
    const BG_IMAGE = "https://rev-ai.io/wp-content/uploads/2022/03/Transaction-Tracking-and-Analytics-Steering-Car-Rental-banner.webp";
    
    // --- STATE MANAGEMENT ---
    const [bookings, setBookings] = useState([]); // Stores the list of confirmed bookings
    const [loading, setLoading] = useState(true); // Manages the data-loading spinner
    const [isEditMode, setIsEditMode] = useState(false); // Toggles the visibility of the Edit panel
    const [selectedBooking, setSelectedBooking] = useState({ id: null, customerName: '', pickupDate: '' }); // Data being edited
    
    // 🔥 Toast Notification State
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    
    // Retrieves the unique ID of the logged-in agent from local storage
    const agentId = localStorage.getItem('userId'); 

    // Helper function to trigger a popup alert (Toast)
    const showToast = (msg, sev = 'success') => setSnackbar({ open: true, message: msg, severity: sev });

    /**
     * DATA FETCHING logic
     * Retrieves the history of bookings processed specifically by this agent.
     */
    const fetchMyRealBookings = useCallback(async () => {
        try {
            setLoading(true);
            const res = await AgentService.getAgentBookings(agentId);
            setBookings(res.data || []);
        } catch (err) { 
            showToast("Failed to fetch transaction archive.", "error");
        } finally {
            setLoading(false);
        }
    }, [agentId]);

    // Automatically fetches data when the component mounts or agentId changes
    useEffect(() => {
        if (agentId) fetchMyRealBookings();
    }, [agentId, fetchMyRealBookings]);

    // Closes the Toast notification
    const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

    /**
     * EDIT HANDLER
     * Populates the edit form with the selected booking's current data.
     */
    const handleEditClick = (b) => {
        setSelectedBooking({ id: b.bookingId, customerName: b.customerName, pickupDate: b.pickupDate });
        setIsEditMode(true);
        // Smooth scroll to the top so the user sees the edit panel
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    /**
     * UPDATE LOGIC
     * Sends the modified booking data to the backend.
     */
    const handleUpdate = async () => {
        // Simple client-side validation
        if (!selectedBooking.customerName || !selectedBooking.pickupDate) {
            showToast("Validation Error: Fields cannot be empty.", "warning");
            return;
        }
        try {
            await AgentService.updateBooking(selectedBooking.id, selectedBooking);
            showToast("Record updated successfully!"); 
            setIsEditMode(false); // Hide the edit panel
            fetchMyRealBookings(); // Refresh the table data
        } catch (err) {
            showToast("Critical: Update failed. System offline.", "error");
        }
    };

    /**
     * DELETE LOGIC
     * Permanently removes a booking record after user confirmation.
     */
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this archive?")) {
            try {
                await AgentService.deleteBooking(id);
                showToast("Record permanently deleted.", "success"); 
                fetchMyRealBookings(); // Refresh the table data
            } catch (err) {
                showToast("Critical: Deletion failed.", "error");
            }
        }
    };

    return (
        <Box sx={{ 
            bgcolor: '#000', minHeight: '100vh', pb: 10, color: '#ffffff',
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.85), rgba(0,0,0,0.92)), url(${BG_IMAGE})`,
            backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'
        }}>
            
            {/* --- HERO HEADER: Page title and icon --- */}
            <Box sx={{ py: 10, textAlign: 'center' }}>
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" mb={1}>
                        <HistoryIcon sx={{ color: PRIMARY_ORANGE, fontSize: 24 }} />
                        <Typography variant="overline" sx={{ color: PRIMARY_ORANGE, letterSpacing: 10, fontWeight: 900 }}>
                            DRIVEEASE ELITE
                        </Typography>
                    </Stack>
                    <Typography variant="h2" fontWeight="900" sx={{ mb: 2 }}>
                        TRANSACTION <span style={{ color: PRIMARY_ORANGE }}>ARCHIVE</span>
                    </Typography>
                </motion.div>
            </Box>

            <Container maxWidth="lg">
                
                {/* --- EDIT PANEL: Appears only when an agent clicks 'Edit' --- */}
                <AnimatePresence>
                    {isEditMode && (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                            <Paper sx={{ 
                                p: 4, mb: 6, bgcolor: 'rgba(10, 10, 10, 0.95)', backdropFilter: 'blur(20px)', borderRadius: 2, 
                                border: `1px solid ${PRIMARY_ORANGE}`, boxShadow: `0 10px 40px ${PRIMARY_ORANGE}22`
                            }}>
                                <Typography variant="h6" sx={{ mb: 2, fontWeight: 900, color: PRIMARY_ORANGE }}>REVISING RECORD: #{selectedBooking.id}</Typography>
                                
                                {/* Divider used to separate title from form fields */}
                                <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', mb: 3 }} />

                                <Grid container spacing={3} alignItems="center">
                                    <Grid item xs={12} sm={4}>
                                        <TextField fullWidth label="CUSTOMER NAME" variant="outlined" size="small"
                                            value={selectedBooking.customerName} 
                                            onChange={(e) => setSelectedBooking({...selectedBooking, customerName: e.target.value})}
                                            sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }}
                                            InputLabelProps={{ sx: { color: PRIMARY_ORANGE } }}
                                            inputProps={{ sx: { color: '#fff' } }} 
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <TextField fullWidth type="date" label="PICKUP DATE" variant="outlined" size="small"
                                            value={selectedBooking.pickupDate} 
                                            onChange={(e) => setSelectedBooking({...selectedBooking, pickupDate: e.target.value})}
                                            InputLabelProps={{ shrink: true, sx: { color: PRIMARY_ORANGE } }}
                                            sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }}
                                            inputProps={{ sx: { color: '#fff' } }} 
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <Stack direction="row" spacing={2}>
                                            <Button fullWidth variant="contained" onClick={handleUpdate} sx={{ bgcolor: PRIMARY_ORANGE, fontWeight: 900 }}>UPDATE</Button>
                                            <Button fullWidth variant="outlined" onClick={() => setIsEditMode(false)} sx={{ color: '#fff', borderColor: '#fff' }}>CANCEL</Button>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* --- TABLE: Displays the list of confirmed transactions --- */}
                <TableContainer component={Paper} sx={{ bgcolor: 'rgba(10, 10, 10, 0.8)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2 }}>
                    {loading ? (
                        <Box sx={{ textAlign: 'center', py: 10 }}><CircularProgress sx={{ color: PRIMARY_ORANGE }} /></Box>
                    ) : (
                        <Table>
                            <TableHead sx={{ bgcolor: 'rgba(255,255,255,0.05)' }}>
                                <TableRow>
                                    <TableCell sx={{ color: PRIMARY_ORANGE, fontWeight: 900 }}>ID</TableCell>
                                    <TableCell sx={{ color: PRIMARY_ORANGE, fontWeight: 900 }}>CUSTOMER</TableCell>
                                    <TableCell sx={{ color: PRIMARY_ORANGE, fontWeight: 900 }}>VEHICLE</TableCell>
                                    <TableCell sx={{ color: PRIMARY_ORANGE, fontWeight: 900 }}>PICKUP</TableCell>
                                    <TableCell sx={{ color: PRIMARY_ORANGE, fontWeight: 900 }} align="center">TOTAL</TableCell>
                                    <TableCell sx={{ color: PRIMARY_ORANGE, fontWeight: 900 }} align="center">ACTIONS</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {bookings.map((b) => (
                                    <TableRow key={b.bookingId} hover sx={{ '&:hover': { bgcolor: 'rgba(255, 87, 34, 0.05) !important' } }}>
                                        <TableCell sx={{ color: 'rgba(255,255,255,0.4)' }}>#{b.bookingId}</TableCell>
                                        <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>{b.customerName}</TableCell>
                                        <TableCell>
                                            <Chip label={b.vehicleContract?.vehicleType || "N/A"} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 1 }} />
                                        </TableCell>
                                        <TableCell sx={{ color: '#ffffff', opacity: 0.8 }}>{b.pickupDate}</TableCell>
                                        <TableCell align="center" sx={{ color: PRIMARY_ORANGE, fontWeight: 900 }}>LKR {b.finalPrice?.toLocaleString()}</TableCell>
                                        <TableCell align="center">
                                            <IconButton sx={{ color: '#fff', '&:hover': { color: PRIMARY_ORANGE } }} onClick={() => handleEditClick(b)}><EditIcon fontSize="small" /></IconButton>
                                            <IconButton sx={{ color: '#fff', '&:hover': { color: '#ff1744' } }} onClick={() => handleDelete(b.bookingId)}><DeleteIcon fontSize="small" /></IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </TableContainer>
            </Container>

            {/* 🔥 GLOBAL NOTIFICATIONS (Toast) */}
            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%', bgcolor: snackbar.severity === 'success' ? '#1b3320' : '#331b1b', color: '#fff', border: `1px solid ${snackbar.severity === 'success' ? '#4caf50' : '#f44336'}`, borderRadius: 1 }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default AgentInventory;