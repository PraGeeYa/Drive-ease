import React, { useState, useEffect, useCallback } from 'react';
import { 
    Container, Typography, Paper, Box, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, IconButton, Stack, TextField, 
    Button, Snackbar, Alert, Divider, Chip, Grid 
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import HistoryIcon from '@mui/icons-material/History';
import AgentService from '../api/Services/AgentService';

const AgentInventory = () => {
    const PRIMARY_ORANGE = "#ff5722";
    // Oya deepu image URL eka
    const BG_IMAGE = "https://www.astarlimousineqa.com/wp-content/uploads/2023/12/car-rentingg.png";
    
    const [bookings, setBookings] = useState([]); 
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState({ id: null, customerName: '', pickupDate: '' });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    
    const agentId = localStorage.getItem('userId'); 

    const fetchMyRealBookings = useCallback(async () => {
        try {
            const res = await AgentService.getAgentBookings(agentId);
            setBookings(res.data || []);
        } catch (err) { 
            console.error("Loading failed", err);
        }
    }, [agentId]);

    useEffect(() => {
        if (agentId) fetchMyRealBookings();
    }, [agentId, fetchMyRealBookings]);

    const showMessage = (msg, sev = 'success') => setSnackbar({ open: true, message: msg, severity: sev });

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbar({ ...snackbar, open: false });
    };

    const handleEditClick = (b) => {
        setSelectedBooking({ id: b.bookingId, customerName: b.customerName, pickupDate: b.pickupDate });
        setIsEditMode(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleUpdate = async () => {
        if (!selectedBooking.id) {
            showMessage("ID is missing!", "error");
            return;
        }
        try {
            await AgentService.updateBooking(selectedBooking.id, selectedBooking);
            showMessage("Record updated successfully!");
            setIsEditMode(false);
            fetchMyRealBookings();
        } catch (err) {
            showMessage("Update failed. Check backend.", "error");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Confirm deletion?")) {
            try {
                await AgentService.deleteBooking(id);
                showMessage("Record deleted!");
                fetchMyRealBookings();
            } catch (err) {
                showMessage("Deletion failed.", "error");
            }
        }
    };

    return (
        <Box sx={{ 
            bgcolor: '#000', 
            minHeight: '100vh', 
            pb: 10, 
            color: '#ffffff',
            // --- Global Background Styling ---
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.85), rgba(0,0,0,0.92)), url(${BG_IMAGE})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
        }}>
            
            {/* --- HERO HEADER --- */}
            <Box sx={{ py: 8, textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" mb={1}>
                        <HistoryIcon sx={{ color: PRIMARY_ORANGE, fontSize: 24 }} />
                        <Typography variant="overline" sx={{ color: PRIMARY_ORANGE, letterSpacing: 6, fontWeight: 900 }}>
                            TRANSACTION ARCHIVE
                        </Typography>
                    </Stack>
                    <Typography variant="h2" fontWeight="900" sx={{ textShadow: '2px 2px 10px rgba(0,0,0,0.5)' }}>
                        BOOKING <span style={{ color: PRIMARY_ORANGE }}>INVENTORY</span>
                    </Typography>
                </motion.div>
            </Box>

            <Container maxWidth="lg" sx={{ mt: 4 }}>
                
                {/* --- REVISION PANEL (Glass-morphism) --- */}
                <AnimatePresence>
                    {isEditMode && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                            <Paper sx={{ 
                                p: 4, mb: 4, 
                                bgcolor: 'rgba(20, 20, 20, 0.9)', 
                                backdropFilter: 'blur(10px)',
                                borderRadius: 0, 
                                border: `2px solid ${PRIMARY_ORANGE}`,
                                boxShadow: `0 0 20px ${PRIMARY_ORANGE}33`
                            }}>
                                <Typography variant="h6" sx={{ mb: 2, fontWeight: 900, color: PRIMARY_ORANGE }}>EDITING RECORD: #{selectedBooking.id}</Typography>
                                <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', mb: 3 }} />
                                <Grid container spacing={3} alignItems="flex-end">
                                    <Grid item xs={12} sm={4}>
                                        <TextField fullWidth label="CUSTOMER NAME" variant="standard" 
                                            value={selectedBooking.customerName} 
                                            onChange={(e) => setSelectedBooking({...selectedBooking, customerName: e.target.value})}
                                            InputLabelProps={{ style: { color: PRIMARY_ORANGE } }}
                                            inputProps={{ style: { color: '#ffffff' } }} 
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <TextField fullWidth type="date" label="PICKUP DATE" variant="standard" InputLabelProps={{ shrink: true, style: { color: PRIMARY_ORANGE } }}
                                            value={selectedBooking.pickupDate} onChange={(e) => setSelectedBooking({...selectedBooking, pickupDate: e.target.value})}
                                            inputProps={{ style: { color: '#ffffff' } }} 
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <Stack direction="row" spacing={2}>
                                            <Button fullWidth variant="contained" onClick={handleUpdate} sx={{ bgcolor: PRIMARY_ORANGE, fontWeight: 900, borderRadius: 0 }}>UPDATE</Button>
                                            <Button fullWidth variant="outlined" onClick={() => setIsEditMode(false)} sx={{ color: '#ffffff', borderColor: '#ffffff', borderRadius: 0 }}>CANCEL</Button>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* --- TABLE WITH GLASS-MORPHISM --- */}
                <TableContainer component={Paper} sx={{ 
                    bgcolor: 'rgba(10, 10, 10, 0.8)', 
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.05)', 
                    borderRadius: 0,
                    boxShadow: '0 20px 50px rgba(0,0,0,0.7)'
                }}>
                    <Table>
                        <TableHead sx={{ bgcolor: 'rgba(20, 20, 20, 0.5)' }}>
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
                                        <Chip label={b.vehicleContract?.vehicleType || "N/A"} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 0 }} />
                                    </TableCell>
                                    <TableCell sx={{ color: '#ffffff', opacity: 0.8 }}>{b.pickupDate}</TableCell>
                                    <TableCell align="center" sx={{ color: PRIMARY_ORANGE, fontWeight: 900 }}>LKR {b.finalPrice?.toLocaleString()}</TableCell>
                                    <TableCell align="center">
                                        <IconButton sx={{ color: '#ffffff', '&:hover': { color: PRIMARY_ORANGE } }} onClick={() => handleEditClick(b)}><EditIcon fontSize="small" /></IconButton>
                                        <IconButton sx={{ color: '#ffffff', '&:hover': { color: '#ff1744' } }} onClick={() => handleDelete(b.bookingId)}><DeleteIcon fontSize="small" /></IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>

            {/* --- NOTIFICATIONS --- */}
            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%', borderRadius: 0, bgcolor: snackbar.severity === 'success' ? '#1b3320' : '#331b1b', color: '#fff', border: `1px solid ${snackbar.severity === 'success' ? '#4caf50' : '#f44336'}` }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default AgentInventory;