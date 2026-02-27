import React, { useState, useEffect, useCallback } from 'react';
import { 
    Container, Typography, Paper, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Button, Chip, IconButton, 
    Box, Stack, Snackbar, Alert 
} from '@mui/material';
import { motion } from 'framer-motion';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import AgentService from '../api/Services/AgentService'; 

const AgentRequests = () => {
    const PRIMARY_ORANGE = "#ff5722";
    // Background image URL eka
    const BG_IMAGE = "https://st2.depositphotos.com/1022214/5248/i/450/depositphotos_52489449-stock-photo-man-offering-a-car-key.jpg";
    
    const [requests, setRequests] = useState([]);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const agentId = localStorage.getItem('userId'); 

    const loadRequests = useCallback(async () => {
        try {
            const res = await AgentService.getRequestsByAgent(agentId);
            setRequests(res.data || []);
        } catch (err) { 
            console.error("Error loading requests", err); 
        }
    }, [agentId]);

    useEffect(() => { 
        loadRequests(); 
    }, [loadRequests]);

    const showMessage = (msg, sev = 'success') => setSnackbar({ open: true, message: msg, severity: sev });

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbar({ ...snackbar, open: false });
    };

    const handleApprove = async (req) => {
        try {
            const payload = {
                requestId: req.requestId,
                customerId: req.customer.userId,
                agentId: agentId,
                contractId: req.vehicleContract.contractId,
                vehicleCount: 1, 
                rentalDays: 1,   
                finalPrice: req.finalPrice
            };

            const res = await AgentService.confirmBooking(payload);
            if (res.status === 200) {
                showMessage("Booking approved & confirmation email dispatched!");
                loadRequests(); 
            }
        } catch (err) {
            showMessage("Approval failed. Please check network.", "error");
        }
    };

    const handleReject = async (requestId) => {
        if (window.confirm("Confirm rejection of this request?")) {
            try {
                await AgentService.rejectRequest(requestId);
                showMessage("Request rejected and purged.", "info");
                loadRequests(); 
            } catch (err) {
                showMessage("Rejection failed.", "error");
            }
        }
    };

    const tableHeaderStyle = { 
        bgcolor: '#111', 
        '& .MuiTableCell-root': { color: PRIMARY_ORANGE, fontWeight: 'bold', borderBottom: '1px solid #222', textAlign: 'center' } 
    };

    return (
        <Box sx={{ 
            bgcolor: '#000', 
            minHeight: '100vh', 
            pb: 10, 
            color: '#fff',
            // --- Global Background Styling ---
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0.9)), url(${BG_IMAGE})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
        }}>
            
            {/* --- HERO HEADER --- */}
            <Box sx={{ py: 8, textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" mb={1}>
                        <PendingActionsIcon sx={{ color: PRIMARY_ORANGE, fontSize: 24 }} />
                        <Typography variant="overline" sx={{ color: PRIMARY_ORANGE, letterSpacing: 4, fontWeight: 900 }}>
                            SERVICE QUEUE
                        </Typography>
                    </Stack>
                    <Typography variant="h2" fontWeight="900" sx={{ textShadow: '2px 2px 10px rgba(0,0,0,0.5)' }}>
                        INCOMING <span style={{ color: PRIMARY_ORANGE }}>REQUESTS</span>
                    </Typography>
                </motion.div>
            </Box>

            <Container maxWidth="lg" sx={{ mt: 4 }}>
                {/* --- TABLE WITH GLASS-MORPHISM EFFECT --- */}
                <TableContainer component={Paper} sx={{ 
                    bgcolor: 'rgba(10, 10, 10, 0.85)', // Semi-transparent effect
                    backdropFilter: 'blur(10px)', 
                    border: '1px solid rgba(255,255,255,0.05)', 
                    borderRadius: 0,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
                }}>
                    <Table>
                        <TableHead sx={tableHeaderStyle}>
                            <TableRow>
                                <TableCell>CUSTOMER</TableCell>
                                <TableCell>VEHICLE TYPE</TableCell>
                                <TableCell>QUOTED PRICE</TableCell>
                                <TableCell>STATUS</TableCell>
                                <TableCell>ACTIONS</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {requests.length > 0 ? requests.map((req) => (
                                <TableRow key={req.requestId} hover sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.03) !important' } }}>
                                    <TableCell sx={{ color: '#fff', textAlign: 'center', fontWeight: '500' }}>
                                        {req.customer?.username || 'GUEST'}
                                    </TableCell>
                                    <TableCell sx={{ color: '#fff', textAlign: 'center' }}>
                                        <Chip label={req.vehicleType} size="small" sx={{ bgcolor: 'rgba(255, 87, 34, 0.1)', color: PRIMARY_ORANGE, borderRadius: 0, fontWeight: 'bold', border: `1px solid ${PRIMARY_ORANGE}44` }} />
                                    </TableCell>
                                    <TableCell sx={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>
                                        LKR {req.finalPrice.toLocaleString()}
                                    </TableCell>
                                    <TableCell sx={{ textAlign: 'center' }}>
                                        <Chip 
                                            label={req.status} 
                                            variant="outlined"
                                            sx={{ 
                                                color: req.status === 'PENDING' ? '#ffb300' : '#4caf50', 
                                                borderColor: req.status === 'PENDING' ? '#ffb300' : '#4caf50',
                                                borderRadius: 0,
                                                fontSize: '0.7rem',
                                                fontWeight: '900'
                                            }} 
                                        />
                                    </TableCell>
                                    <TableCell sx={{ textAlign: 'center' }}>
                                        {req.status === 'PENDING' ? (
                                            <Stack direction="row" spacing={1} justifyContent="center">
                                                <Button 
                                                    variant="contained" 
                                                    startIcon={<CheckCircleIcon />}
                                                    sx={{ bgcolor: '#4caf50', borderRadius: 0, fontWeight: 'bold', '&:hover': { bgcolor: '#388e3c' } }}
                                                    onClick={() => handleApprove(req)}
                                                >
                                                    Approve
                                                </Button>
                                                <IconButton 
                                                    sx={{ color: '#ff1744', bgcolor: 'rgba(255, 23, 68, 0.05)', '&:hover': { bgcolor: 'rgba(255, 23, 68, 0.2)' } }} 
                                                    onClick={() => handleReject(req.requestId)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Stack>
                                        ) : (
                                            <Typography variant="body2" sx={{ opacity: 0.5, letterSpacing: 1 }}>COMPLETED</Typography>
                                        )}
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 10, color: 'rgba(255,255,255,0.4)' }}>
                                        No pending requests currently in the queue.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>

            {/* --- NOTIFICATIONS --- */}
            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%', borderRadius: 0, bgcolor: '#1b3320', color: '#fff', border: '1px solid #4caf50' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default AgentRequests;