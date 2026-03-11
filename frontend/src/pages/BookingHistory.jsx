import React, { useState, useEffect, useCallback } from 'react';
import { 
    Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, 
    TableHead, TableRow, IconButton, Chip, Stack, CircularProgress, 
    Snackbar, Alert, Container, Tabs, Tab, Button 
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import BookingService from '../api/BookingService';
import { authService } from '../api/authService';
import apiClient from '../api/axiosConfig';

// Icons
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DateRangeIcon from '@mui/icons-material/DateRange';
import LogoutIcon from '@mui/icons-material/Logout';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const BookingHistory = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [tabValue, setTabValue] = useState(0);
    const [bookings, setBookings] = useState([]); 
    const [requests, setRequests] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false); // Approval loading state
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const fetchData = useCallback(async () => {
        const agentId = authService.getUserId();
        if (!agentId) return;

        try {
            setLoading(true);
            const bookingData = await BookingService.getAgentBookings(agentId);
            setBookings(bookingData || []);
            
            const requestData = await BookingService.getAgentRequests(agentId); 
            setRequests(requestData || []);
        } catch (err) {
            setSnackbar({ open: true, message: "Sync failed with database", severity: "error" });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    // 🔥 APPROVAL LOGIC: Confirm inquiry and send email
    const handleApprove = async (req) => {
        try {
            setProcessing(true);
            
            // Backend Controller (@PostMapping("/confirm")) එකට ගැලපෙන payload එක
            const payload = {
                requestId: req.requestId,
                customerId: req.customer?.userId,
                agentId: authService.getUserId(),
                contractId: req.vehicleContract?.contractId,
                rentalDays: 1, // DTO එකේ තියෙන default අගය
                vehicleCount: 1,
                finalPrice: req.finalPrice,
                customerEmail: req.customerEmail // Email service එකට අවශ්‍යයි
            };

            // Path: /api/bookings/confirm
            await apiClient.post('/bookings/confirm', payload);
            
            setSnackbar({ 
                open: true, 
                message: "Booking Approved! Confirmation email sent to customer.", 
                severity: "success" 
            });
            
            fetchData(); // Tables refresh කරනවා
        } catch (err) {
            console.error("Approval Error:", err);
            setSnackbar({ open: true, message: "Approval failed. Check server logs.", severity: "error" });
        } finally {
            setProcessing(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Cancel this record?")) {
            try {
                await BookingService.deleteBooking(id);
                setSnackbar({ open: true, message: "Deleted successfully", severity: "info" });
                fetchData();
            } catch (err) {
                setSnackbar({ open: true, message: "Delete failed", severity: "error" });
            }
        }
    };

    return (
        <Box sx={{ display: 'flex', bgcolor: '#f4f7fa', minHeight: '100vh', pt: 12 }}>
            {/* SIDEBAR NAVIGATION */}
            <Paper elevation={0} sx={{ width: 80, height: '100vh', position: 'fixed', left: 0, top: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4, borderRight: '1px solid #e2e8f0', bgcolor: '#fff', zIndex: 1201 }}>
                <DirectionsCarIcon sx={{ color: theme.palette.primary.main, fontSize: 32, mb: 6 }} />
                <Stack spacing={3}>
                    <IconButton onClick={() => navigate('/agent-dashboard')}><DashboardIcon /></IconButton>
                    <IconButton onClick={() => navigate('/fleet-management')}><DirectionsCarIcon /></IconButton>
                    <IconButton color="primary" sx={{ bgcolor: `${theme.palette.primary.main}12` }} onClick={() => navigate('/booking-history')}><DateRangeIcon /></IconButton>
                </Stack>
                <Box sx={{ mt: 'auto' }}>
                    <IconButton sx={{ color: '#ef4444' }} onClick={() => { authService.logoutUser(); navigate('/login'); }}><LogoutIcon /></IconButton>
                </Box>
            </Paper>

            <Box sx={{ flexGrow: 1, ml: '80px', p: { xs: 2, md: 5 } }}>
                <Container maxWidth="xl">
                    <Typography variant="h3" fontWeight={1000} mb={1}>Operational <span style={{ color: theme.palette.primary.main }}>History</span></Typography>
                    <Typography variant="body2" color="text.secondary" mb={4}>Review confirmed contracts and pending customer inquiries.</Typography>

                    <Tabs value={tabValue} onChange={(e, val) => setTabValue(val)} sx={{ mb: 4, '& .MuiTab-root': { fontWeight: 800 } }}>
                        <Tab label="Confirmed Contracts" />
                        <Tab label="Incoming Inquiries" />
                    </Tabs>

                    <TableContainer component={Paper} sx={{ borderRadius: '35px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                        <Table sx={{ minWidth: 1000 }}>
                            <TableHead sx={{ bgcolor: '#f8fafc' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 800, py: 3, pl: 5 }}>ID</TableCell>
                                    <TableCell sx={{ fontWeight: 800 }}>CUSTOMER INFO</TableCell>
                                    <TableCell sx={{ fontWeight: 800 }}>{tabValue === 0 ? 'PICKUP DATE' : 'VEHICLE TYPE'}</TableCell>
                                    <TableCell sx={{ fontWeight: 800 }}>{tabValue === 0 ? 'DURATION' : 'REQUEST DATE'}</TableCell>
                                    <TableCell sx={{ fontWeight: 800 }}>TOTAL VALUE</TableCell>
                                    <TableCell sx={{ fontWeight: 800 }}>STATUS</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 800, pr: 5 }}>ACTIONS</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody sx={{ bgcolor: '#fff' }}>
                                {loading ? (
                                    <TableRow><TableCell colSpan={7} align="center" sx={{ py: 10 }}><CircularProgress /></TableCell></TableRow>
                                ) : (tabValue === 0 ? bookings : requests).map((item) => (
                                    <TableRow key={item.bookingId || item.requestId} hover>
                                        <TableCell sx={{ pl: 5, fontWeight: 800 }}>#{item.bookingId || item.requestId}</TableCell>
                                        
                                        <TableCell>
                                            <Typography fontWeight={700}>{item.customerName || item.customer?.username || "Guest"}</Typography>
                                            <Typography variant="caption" color="text.secondary">{item.customerEmail || item.customer?.email}</Typography>
                                        </TableCell>

                                        <TableCell>{tabValue === 0 ? item.pickupDate : item.vehicleType}</TableCell>

                                        <TableCell>
                                            {tabValue === 0 ? 
                                                `${item.rentalDays} Days` : 
                                                new Date(item.requestDate).toLocaleDateString()
                                            }
                                        </TableCell>

                                        <TableCell>
                                            <Typography fontWeight={900} color="primary">LKR {item.finalPrice?.toLocaleString()}</Typography>
                                        </TableCell>

                                        <TableCell>
                                            <Chip 
                                                label={item.status || "CONFIRMED"} 
                                                color={item.status === 'APPROVED' || tabValue === 0 ? 'success' : 'warning'} 
                                                size="small" 
                                                sx={{ fontWeight: 900 }} 
                                            />
                                        </TableCell>

                                        <TableCell align="right" sx={{ pr: 5 }}>
                                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                                                {tabValue === 0 ? (
                                                    <IconButton onClick={() => handleDelete(item.bookingId)} sx={{ bgcolor: '#fff1f2', color: '#e11d48' }}><DeleteIcon fontSize="small" /></IconButton>
                                                ) : (
                                                    <Button 
                                                        variant="contained" 
                                                        disabled={item.status === 'APPROVED' || processing}
                                                        startIcon={processing ? <CircularProgress size={16} /> : <CheckCircleIcon />} 
                                                        onClick={() => handleApprove(item)}
                                                        size="small" 
                                                        sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 800 }}
                                                    >
                                                        {item.status === 'APPROVED' ? 'Approved' : 'Approve'}
                                                    </Button>
                                                )}
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Container>
            </Box>

            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                <Alert severity={snackbar.severity} sx={{ borderRadius: '15px' }}>{snackbar.message}</Alert>
            </Snackbar>
        </Box>
    );
};

export default BookingHistory;