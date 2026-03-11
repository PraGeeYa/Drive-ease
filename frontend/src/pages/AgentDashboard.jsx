import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Box, Grid, Typography, Paper, TextField, MenuItem, Button, Slider,
    Checkbox, FormControlLabel, Card, CardContent, CardMedia, Chip,
    IconButton, Stack, Avatar, CircularProgress, Snackbar, Alert,
    Divider, Modal, Fade, Backdrop, Skeleton
} from '@mui/material';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosConfig';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DateRangeIcon from '@mui/icons-material/DateRange';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; // 🔥 Added for Profile

const AgentDashboard = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const agentId = localStorage.getItem('userId');

    // --- STATES ---
    const [loading, setLoading] = useState(true);
    const [vehicles, setVehicles] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 100000]);
    const [searchType, setSearchType] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    
    const [openModal, setOpenModal] = useState(false);
    const [selectedCar, setSelectedCar] = useState(null);
    const [bookingInfo, setBookingInfo] = useState({ 
        customerName: '', 
        days: 1, 
        pickupDate: '', 
        vehicleCount: 1, 
        requirements: '' 
    });

    // --- API CALLS ---
    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [fleetRes, requestRes] = await Promise.all([
                apiClient.get('/admin/vehicles'),
                apiClient.get(`/booking-requests/agent/${agentId}`)
            ]);
            setVehicles(fleetRes.data || []);
            setPendingRequests(requestRes.data?.filter(r => r.status === 'PENDING') || []);
        } catch (err) {
            console.error("Dashboard Data Error:", err);
            setSnackbar({ open: true, message: "Real-time sync failed", severity: "error" });
        } finally {
            setLoading(false);
        }
    }, [agentId]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleApproveRequest = async (requestId) => {
        try {
            await apiClient.patch(`/booking-requests/${requestId}/approve`);
            setSnackbar({ open: true, message: "Booking Approved Successfully!", severity: "success" });
            fetchData();
        } catch (err) {
            setSnackbar({ open: true, message: "Failed to approve request", severity: "error" });
        }
    };

    // --- LOGIC ---
    const uniqueVehicleCategories = useMemo(() => {
        const types = vehicles.map(v => v.vehicleType).filter(Boolean);
        return [...new Set(types)];
    }, [vehicles]);

    const filteredVehicles = useMemo(() => {
        return vehicles.filter(v => {
            const matchesCategory = searchType === 'ALL' || v.vehicleType === searchType;
            const matchesPrice = (v.baseRatePerDay || v.finalPrice) >= priceRange[0] && 
                                 (v.baseRatePerDay || v.finalPrice) <= priceRange[1];
            const matchesSearch = v.vehicleType.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesPrice && matchesSearch;
        });
    }, [vehicles, searchType, priceRange, searchTerm]);

    const handleReserveClick = (car) => {
        setSelectedCar(car);
        setBookingInfo({ customerName: '', days: 1, pickupDate: '', vehicleCount: 1, requirements: '' });
        setOpenModal(true);
    };

    const handleConfirmBooking = async () => {
        if (!bookingInfo.customerName || !bookingInfo.pickupDate) {
            setSnackbar({ open: true, message: "Customer Name and Pickup Date are required!", severity: "warning" });
            return;
        }

        try {
            const unitPrice = selectedCar?.baseRatePerDay || selectedCar?.finalPrice || 0;
            const baseTotal = unitPrice * bookingInfo.days * bookingInfo.vehicleCount;
            const finalPriceWithFee = baseTotal * 1.10; 

            const payload = {
                vehicleId: selectedCar.contractId || selectedCar.id, 
                agentId: agentId, 
                customerId: agentId, 
                customerName: bookingInfo.customerName,
                rentalDays: parseInt(bookingInfo.days),
                vehicleCount: parseInt(bookingInfo.vehicleCount),
                pickupDate: bookingInfo.pickupDate,
                finalPrice: finalPriceWithFee
            };

            await apiClient.post('/bookings/create', payload);
            setSnackbar({ open: true, message: "Direct Reservation Executed!", severity: "success" });
            setOpenModal(false);
            fetchData(); 
        } catch (err) {
            setSnackbar({ open: true, message: "Transaction failed", severity: "error" });
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        // 🔥 Container setup to handle fixed Sidebar and Header offset
        <Box sx={{ display: 'flex', bgcolor: '#f4f7fe', minHeight: '100vh' }}>
            
            {/* 1. FIXED ICON SIDEBAR - Adjusted top to not hide under header */}
            <Paper elevation={0} sx={{ 
                width: 85, height: '100vh', position: 'fixed', left: 0, top: 0,
                display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4, 
                borderRadius: 0, borderRight: '1px solid #e2e8f0', bgcolor: '#fff', zIndex: 1400 
            }}>
                {/* Brand Icon */}
                <Box sx={{ mb: 6, p: 1.5, bgcolor: '#3b82f615', borderRadius: '12px' }}>
                    <DirectionsCarIcon sx={{ color: theme.palette.primary.main, fontSize: 30 }} />
                </Box>

                {/* Navigation Stack */}
                <Stack spacing={2.5} sx={{ alignItems: 'center' }}>
                    <IconButton color="primary" sx={{ bgcolor: `${theme.palette.primary.main}15`, p: 1.5 }} onClick={() => navigate('/agent-dashboard')}>
                        <DashboardIcon />
                    </IconButton>
                    <IconButton sx={{ color: '#94a3b8' }} onClick={() => navigate('/fleet-management')} title="Fleet">
                        <DirectionsCarIcon />
                    </IconButton>
                    <IconButton sx={{ color: '#94a3b8' }} onClick={() => navigate('/booking-history')} title="History">
                        <DateRangeIcon />
                    </IconButton>
                    
                    <Divider sx={{ width: '40%', my: 1 }} />
                    
                    
                </Stack>

                {/* Bottom Actions */}
                <Box sx={{ mt: 'auto' }}>
                    <IconButton sx={{ color: '#94a3b8', mb: 1 }} onClick={() => navigate('/settings')} title="Settings">
                        <SettingsIcon />
                    </IconButton>
                    <IconButton sx={{ color: '#ef4444', mb: 2 }} onClick={handleLogout} title="Logout">
                        <LogoutIcon />
                    </IconButton>
                </Box>
            </Paper>

            {/* 2. MAIN CONTENT AREA - Padding Top Adjusted to 12 (Fixed spacing) */}
            <Box sx={{ flexGrow: 1, ml: '85px', p: { xs: 2, md: 5 }, pt: 12 }}>
                
                {/* HEADER SECTION */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6, flexWrap: 'wrap', gap: 2 }}>
                    <Box>
                        <Typography variant="h3" sx={{ fontWeight: 1000, color: '#1b2559', letterSpacing: -1.5 }}>
                            Terminal <span style={{ color: theme.palette.primary.main }}>Control</span>
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>Live Fleet Monitoring & Inquiry Desk</Typography>
                    </Box>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Paper elevation={0} sx={{ bgcolor: '#fff', borderRadius: '20px', px: 2, py: 1, display: 'flex', alignItems: 'center', border: '1px solid #e2e8f0' }}>
                            <SearchIcon sx={{ color: '#94a3b8', mr: 1 }} />
                            <input 
                                placeholder="Search inventory..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ border: 'none', outline: 'none', background: 'transparent', fontWeight: 600, width: '180px' }} 
                            />
                        </Paper>
                        <Avatar src={`https://ui-avatars.com/api/?name=Agent&background=3b82f6&color=fff`} sx={{ width: 48, height: 48, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    </Stack>
                </Box>

                {/* QUICK STATS */}
                <Grid container spacing={3} sx={{ mb: 6 }}>
                    {[
                        { label: 'Queue Size', value: pendingRequests.length, icon: <NotificationsNoneIcon />, color: '#f59e0b' },
                        { label: 'Available Units', value: vehicles.length, icon: <DirectionsCarIcon />, color: '#16a34a' },
                        { label: 'Total Volume', value: 'LKR 850k', icon: <AccountBalanceWalletIcon />, color: theme.palette.secondary.main },
                    ].map((stat, i) => (
                        <Grid item xs={12} sm={4} key={i}>
                            <Paper sx={{ p: 3, borderRadius: '24px', display: 'flex', alignItems: 'center', border: '1px solid #e2e8f0', bgcolor: '#fff' }}>
                                <Avatar sx={{ bgcolor: `${stat.color}15`, color: stat.color, width: 55, height: 55, mr: 2, borderRadius: '15px' }}>{stat.icon}</Avatar>
                                <Box>
                                    <Typography variant="caption" color="text.secondary" fontWeight={800} sx={{ textTransform: 'uppercase' }}>{stat.label}</Typography>
                                    <Typography variant="h4" fontWeight={1000} color="#1b2559">{stat.value}</Typography>
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>

                {/* INCOMING QUEUE */}
                <Typography variant="h5" sx={{ fontWeight: 900, mb: 3, color: '#1b2559' }}>Incoming Requests</Typography>
                <Grid container spacing={3} sx={{ mb: 8 }}>
                    {loading ? [1, 2].map(i => <Grid item xs={12} key={i}><Skeleton variant="rectangular" height={80} sx={{ borderRadius: '20px' }} /></Grid>) :
                    pendingRequests.length > 0 ? pendingRequests.map((req) => (
                        <Grid item xs={12} key={req.requestId}>
                            <Paper elevation={0} sx={{ p: 2.5, borderRadius: '22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #e2e8f0', bgcolor: '#fff' }}>
                                <Stack direction="row" spacing={3} alignItems="center">
                                    <Avatar variant="rounded" src={req.imageUrl} sx={{ width: 55, height: 55, borderRadius: '12px' }} />
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight={1000}>{req.vehicleType}</Typography>
                                        <Typography variant="caption" color="primary" fontWeight={800}>{req.customerEmail}</Typography>
                                    </Box>
                                    <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" fontWeight={700}>EXPECTED</Typography>
                                        <Typography variant="body1" fontWeight={1000} color="#1b2559">LKR {req.finalPrice?.toLocaleString()}</Typography>
                                    </Box>
                                </Stack>
                                <Button variant="contained" color="success" startIcon={<CheckCircleOutlineIcon />} onClick={() => handleApproveRequest(req.requestId)} sx={{ borderRadius: '12px', fontWeight: 900, textTransform: 'none', px: 4 }}>Approve</Button>
                            </Paper>
                        </Grid>
                    )) : <Grid item xs={12}><Paper sx={{ p: 4, textAlign: 'center', borderRadius: '22px', border: '1px dashed #cbd5e1', bgcolor: 'transparent' }}><Typography color="text.secondary" fontWeight={700}>Queue is empty.</Typography></Paper></Grid>}
                </Grid>

                {/* FILTERS & FLEET */}
                <Grid container spacing={4}>
                    <Grid item xs={12} lg={3}>
                        <Paper elevation={0} sx={{ p: 4, borderRadius: '30px', bgcolor: '#fff', border: '1px solid #e2e8f0', position: 'sticky', top: 100 }}>
                            <Typography variant="h6" sx={{ fontWeight: 1000, mb: 4, display: 'flex', alignItems: 'center', color: '#1b2559' }}>
                                Inventory Filter <TuneIcon sx={{ ml: 'auto', color: 'primary.main' }} />
                            </Typography>
                            <Stack spacing={4}>
                                <Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2, color: '#475569' }}>Rate Cap (LKR)</Typography>
                                    <Slider value={priceRange} onChange={(e, val) => setPriceRange(val)} min={0} max={100000} step={1000} sx={{ color: theme.palette.primary.main }} />
                                    <Stack direction="row" justifyContent="space-between"><Typography variant="caption" fontWeight={900}>{priceRange[0]}</Typography><Typography variant="caption" fontWeight={900}>{priceRange[1]}</Typography></Stack>
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2, color: '#475569' }}>Class Type</Typography>
                                    <TextField select fullWidth variant="outlined" size="small" value={searchType} onChange={(e) => setSearchType(e.target.value)} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}>
                                        <MenuItem value="ALL">All Categories</MenuItem>
                                        {uniqueVehicleCategories.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
                                    </TextField>
                                </Box>
                            </Stack>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} lg={9}>
                        <Grid container spacing={3}>
                            {loading ? [1, 2, 3].map(i => <Grid item xs={12} md={4} key={i}><Skeleton variant="rectangular" height={300} sx={{ borderRadius: '30px' }} /></Grid>) :
                            filteredVehicles.map((car) => (
                                <Grid item xs={12} md={6} xl={4} key={car.contractId || car.id}>
                                    <Card sx={{ borderRadius: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                                        <CardMedia component="img" height="180" image={car.imageUrl || 'https://via.placeholder.com/400x250'} sx={{ objectFit: 'cover' }} />
                                        <CardContent sx={{ p: 3 }}>
                                            <Typography variant="h6" fontWeight={1000} color="#1b2559">{car.vehicleType}</Typography>
                                            <Typography variant="body2" color="text.secondary" mb={2}>Luxury Performance Edition</Typography>
                                            <Divider sx={{ mb: 2, borderStyle: 'dashed' }} />
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Box>
                                                    <Typography variant="caption" fontWeight={800} color="primary">RATE/DAY</Typography>
                                                    <Typography variant="h6" fontWeight={1000}>LKR {car.baseRatePerDay?.toLocaleString()}</Typography>
                                                </Box>
                                                <Button variant="contained" onClick={() => handleReserveClick(car)} sx={{ borderRadius: '15px', fontWeight: 900, textTransform: 'none', px: 3 }}>Reserve</Button>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
            </Box>

            {/* MODAL SECTION */}
            <Modal open={openModal} onClose={() => setOpenModal(false)} closeAfterTransition BackdropComponent={Backdrop} BackdropProps={{ timeout: 500 }}>
                <Fade in={openModal}>
                    <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 480, bgcolor: '#fff', borderRadius: '30px', p: 4, boxShadow: '0 20px 60px rgba(0,0,0,0.1)' }}>
                        <Typography variant="h5" fontWeight={1000} mb={3}>Finalize Reservation</Typography>
                        <Stack spacing={2.5}>
                            <TextField fullWidth label="Client Name" value={bookingInfo.customerName} onChange={(e) => setBookingInfo({...bookingInfo, customerName: e.target.value})} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                            <Grid container spacing={2}>
                                <Grid item xs={6}><TextField fullWidth type="date" label="Pickup" InputLabelProps={{ shrink: true }} value={bookingInfo.pickupDate} onChange={(e) => setBookingInfo({...bookingInfo, pickupDate: e.target.value})} /></Grid>
                                <Grid item xs={6}><TextField fullWidth type="number" label="Days" value={bookingInfo.days} onChange={(e) => setBookingInfo({...bookingInfo, days: e.target.value})} /></Grid>
                            </Grid>
                            <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: '15px' }}>
                                <Typography variant="subtitle1" fontWeight={1000} color="primary">Total: LKR {((selectedCar?.baseRatePerDay || selectedCar?.finalPrice || 0) * bookingInfo.days * 1.1).toLocaleString()}</Typography>
                            </Box>
                            <Button variant="contained" fullWidth onClick={handleConfirmBooking} sx={{ borderRadius: '15px', py: 2, fontWeight: 900 }}>Create Booking</Button>
                        </Stack>
                    </Box>
                </Fade>
            </Modal>

            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                <Alert severity={snackbar.severity} sx={{ borderRadius: '15px', fontWeight: 700 }}>{snackbar.message}</Alert>
            </Snackbar>
        </Box>
    );
};

export default AgentDashboard;