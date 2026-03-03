import React, { useState, useEffect, useCallback, useMemo } from 'react'; 
import { 
    Container, TextField, Button, Grid, Card, CardContent, Typography, 
    Box, MenuItem, Modal, Fade, Backdrop, Paper, Stack, Divider, Chip, Snackbar, Alert, CardMedia, CircularProgress
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion'; 
import { useNavigate } from 'react-router-dom'; 
import SearchIcon from '@mui/icons-material/Search'; 
import EventAvailableIcon from '@mui/icons-material/EventAvailable'; 
import InventoryIcon from '@mui/icons-material/Inventory'; 
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import BookingService from '../api/Services/BookingService'; 
import apiClient from '../api/apiClient'; 

const modalStyle = {
    position: 'absolute', top: '50%', left: '50%',
    transform: 'translate(-50%, -50%)', width: { xs: '90%', sm: 500 },
    bgcolor: 'rgba(10, 10, 10, 0.98)', backdropFilter: 'blur(20px)', borderRadius: 2, 
    boxShadow: '0 25px 60px rgba(0,0,0,0.8)', p: 4,
    color: '#fff', border: '1px solid rgba(255,87,34,0.2)'
};

const AgentDashboard = () => {
    const PRIMARY_ORANGE = "#ff5722"; 
    const DARK_BG = "#000000"; 
    const BG_IMAGE = "https://rev-ai.io/wp-content/uploads/2022/03/Transaction-Tracking-and-Analytics-Steering-Car-Rental-banner.webp";
    const navigate = useNavigate();

    const [searchCriteria, setSearchCriteria] = useState({ type: 'ALL', days: 1, count: 1, pickupDate: '' });
    const [vehicles, setVehicles] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedContract, setSelectedContract] = useState(null);
    const [customerInfo, setCustomerInfo] = useState({ name: '', requirements: '' });
    
    // 🔥 Snackbar (Toast) State
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [loading, setLoading] = useState(true);

    const getVehicleImage = (vehicleName) => {
        return `https://loremflickr.com/800/600/${encodeURIComponent(vehicleName + " car")}`;
    };

    // --- 🛠️ Helper function to trigger Toast ---
    const showToast = (msg, sev = 'success') => setSnackbar({ open: true, message: msg, severity: sev });

    const fetchVehicles = useCallback(async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/vehicles/available');
            setVehicles(response.data || []);
        } catch (err) {
            showToast("System offline. Could not fetch inventory.", "error");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchVehicles();
    }, [fetchVehicles]);

    const filteredResults = useMemo(() => {
        if (searchCriteria.type === 'ALL') return vehicles;
        return vehicles.filter(v => v.vehicleType.toLowerCase().includes(searchCriteria.type.toLowerCase()));
    }, [vehicles, searchCriteria.type]);

    const handleOpenModal = (contract) => {
        setSelectedContract(contract);
        setOpen(true);
    };

    const handleConfirmBooking = async () => {
        // --- Validation with Toast ---
        if (!searchCriteria.pickupDate || !customerInfo.name) {
            showToast("Validation Error: Client name and pickup date required.", "warning");
            return;
        }

        try {
            const basePrice = selectedContract.baseRatePerDay * searchCriteria.days;
            const commission = basePrice * 0.10;
            const total = basePrice + commission;

            const bookingData = {
                contractId: selectedContract.contractId,
                agentId: localStorage.getItem('userId'), 
                customerName: customerInfo.name,
                requirements: customerInfo.requirements,
                rentalDays: searchCriteria.days,
                vehicleCount: searchCriteria.count,
                finalPrice: total, 
                pickupDate: searchCriteria.pickupDate
            };

            await BookingService.createBooking(bookingData);
            showToast("SUCCESS: Reservation executed and verified!"); // 🔥 Success Toast
            setOpen(false);
            setCustomerInfo({ name: '', requirements: '' }); 
        } catch (err) { 
            showToast("CRITICAL: Failed to write booking to database.", "error"); // 🔥 Error Toast
        }
    };

    const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

    return (
        <Box sx={{ 
            bgcolor: DARK_BG, minHeight: '100vh', pb: 10, color: '#fff',
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0.95)), url(${BG_IMAGE})`,
            backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'
        }}>
            
            <Box sx={{ py: { xs: 8, md: 10 }, textAlign: 'center' }}>
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" mb={1}>
                        <EventAvailableIcon sx={{ color: PRIMARY_ORANGE, fontSize: 20 }} />
                        <Typography variant="overline" sx={{ color: PRIMARY_ORANGE, letterSpacing: 10, fontWeight: 900 }}>
                            DRIVEEASE ELITE
                        </Typography>
                    </Stack>
                    <Typography variant="h2" fontWeight="900" sx={{ mb: 3, fontSize: { xs: '2.5rem', md: '4.5rem' } }}>
                        AGENT <span style={{ color: PRIMARY_ORANGE }}>PORTAL</span>
                    </Typography>
                    <Button variant="outlined" startIcon={<InventoryIcon />} onClick={() => navigate('/agent-inventory')}
                        sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)', borderRadius: 1, px: 4, py: 1.2, '&:hover': { borderColor: PRIMARY_ORANGE, color: PRIMARY_ORANGE } }}>
                        ACCESS INVENTORY
                    </Button>
                </motion.div>
            </Box>

            <Container maxWidth="lg">
                <Paper sx={{ p: 4, mb: 6, borderRadius: 2, bgcolor: 'rgba(20, 20, 20, 0.9)', backdropFilter: 'blur(15px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <Grid container spacing={3} alignItems="center">
                        <Grid item xs={12} sm={3}>
                            <TextField select fullWidth label="FLEET CLASS" size="small" variant="outlined" value={searchCriteria.type} onChange={(e) => setSearchCriteria({...searchCriteria, type: e.target.value})} 
                                sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }} 
                                InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.7)' } }} SelectProps={{ sx: { color: '#fff' } }}>
                                <MenuItem value="ALL">All Available</MenuItem>
                                {[...new Set(vehicles.map(v => v.vehicleType))].map(type => <MenuItem key={type} value={type}>{type}</MenuItem>)}
                            </TextField>
                        </Grid>
                        <Grid item xs={6} sm={2}>
                            <TextField fullWidth type="number" label="DAYS" size="small" variant="outlined" value={searchCriteria.days} onChange={(e) => setSearchCriteria({...searchCriteria, days: e.target.value})} 
                                sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }} 
                                InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.7)' } }} inputProps={{ sx: { color: '#fff' } }} />
                        </Grid>
                        <Grid item xs={6} sm={2}>
                            <TextField fullWidth type="number" label="UNITS" size="small" variant="outlined" value={searchCriteria.count} onChange={(e) => setSearchCriteria({...searchCriteria, count: e.target.value})} 
                                sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }} 
                                InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.7)' } }} inputProps={{ sx: { color: '#fff' } }} />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <TextField fullWidth type="date" label="PICKUP" size="small" variant="outlined" value={searchCriteria.pickupDate} onChange={(e) => setSearchCriteria({...searchCriteria, pickupDate: e.target.value})} 
                                sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }} 
                                InputLabelProps={{ shrink: true, sx: { color: 'rgba(255,255,255,0.7)' } }} inputProps={{ sx: { color: '#fff' } }} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <Button variant="contained" fullWidth onClick={fetchVehicles} startIcon={<SearchIcon />} sx={{ bgcolor: PRIMARY_ORANGE, height: 40, fontWeight: 'bold' }}>
                                REFRESH
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>

                {loading ? (
                    <Box sx={{ textAlign: 'center', py: 10 }}><CircularProgress sx={{ color: PRIMARY_ORANGE }} /></Box>
                ) : (
                    <Grid container spacing={4}>
                        <AnimatePresence>
                            {filteredResults.map((item) => (
                                <Grid item xs={12} sm={6} md={4} key={item.contractId}>
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -5 }}>
                                        <Card sx={{ bgcolor: '#0a0a0a', border: '1px solid #222', color: '#fff', borderRadius: 2 }}>
                                            <CardMedia component="img" height="200" image={getVehicleImage(item.vehicleType)} />
                                            <CardContent sx={{ p: 3 }}>
                                                <Stack direction="row" justifyContent="space-between" mb={1}>
                                                    <Typography variant="h6" fontWeight="800">{item.vehicleType.toUpperCase()}</Typography>
                                                    <Chip label="LIVE" size="small" sx={{ bgcolor: '#1b3320', color: '#4caf50', borderRadius: 1, fontWeight: 'bold' }} />
                                                </Stack>
                                                <Typography variant="caption" sx={{ opacity: 0.5 }}>RATE: LKR {item.baseRatePerDay?.toLocaleString()} / DAY</Typography>
                                                <Divider sx={{ borderColor: '#222', my: 2 }} />
                                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                    <Box>
                                                        <Typography variant="caption" sx={{ color: PRIMARY_ORANGE, fontWeight: 700 }}>EST. TOTAL</Typography>
                                                        <Typography variant="h6" fontWeight="800">LKR {(item.baseRatePerDay * searchCriteria.days).toLocaleString()}</Typography>
                                                    </Box>
                                                    <Button variant="outlined" onClick={() => handleOpenModal(item)} sx={{ borderColor: PRIMARY_ORANGE, color: PRIMARY_ORANGE, fontWeight: 'bold' }}>
                                                        BOOK
                                                    </Button>
                                                </Stack>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </Grid>
                            ))}
                        </AnimatePresence>
                    </Grid>
                )}
            </Container>

            <Modal open={open} onClose={() => setOpen(false)} closeAfterTransition BackdropComponent={Backdrop} BackdropProps={{ timeout: 500 }}>
                <Fade in={open}>
                    <Box sx={modalStyle}>
                        <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                            <ReceiptLongIcon sx={{ color: PRIMARY_ORANGE, fontSize: 32 }} />
                            <Typography variant="h5" fontWeight="900">EXECUTE BOOKING</Typography>
                        </Stack>
                        
                        <Stack spacing={2.5}>
                            <Box sx={{ p: 2, bgcolor: 'rgba(255,87,34,0.05)', border: '1px solid rgba(255,87,34,0.2)', borderRadius: 1 }}>
                                <Typography variant="caption" sx={{ color: PRIMARY_ORANGE, fontWeight: 900 }}>UNIT: {selectedContract?.vehicleType}</Typography>
                                {selectedContract && (
                                    <Stack sx={{ mt: 1 }}>
                                        <Stack direction="row" justifyContent="space-between"><Typography variant="body2" sx={{ opacity: 0.6 }}>Rental ({searchCriteria.days} Days)</Typography><Typography variant="body2">LKR {(selectedContract.baseRatePerDay * searchCriteria.days).toLocaleString()}</Typography></Stack>
                                        <Stack direction="row" justifyContent="space-between" sx={{ color: PRIMARY_ORANGE, mt: 0.5 }}><Typography variant="body2">Service Fee (10%)</Typography><Typography variant="body2">+ LKR {(selectedContract.baseRatePerDay * searchCriteria.days * 0.1).toLocaleString()}</Typography></Stack>
                                        <Divider sx={{ my: 1, borderColor: 'rgba(255,255,255,0.1)' }} />
                                        <Stack direction="row" justifyContent="space-between"><Typography variant="h6" fontWeight="900">TOTAL</Typography><Typography variant="h6" fontWeight="900" color={PRIMARY_ORANGE}>LKR {(selectedContract.baseRatePerDay * searchCriteria.days * 1.1).toLocaleString()}</Typography></Stack>
                                    </Stack>
                                )}
                            </Box>

                            <TextField fullWidth label="Client Full Name" variant="outlined" size="small" value={customerInfo.name} onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})} sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }} InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.7)' } }} inputProps={{ sx: { color: '#fff' } }} />
                            <TextField fullWidth label="Requirements" multiline rows={2} variant="outlined" size="small" value={customerInfo.requirements} onChange={(e) => setCustomerInfo({...customerInfo, requirements: e.target.value})} sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }} InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.7)' } }} inputProps={{ sx: { color: '#fff' } }} />
                            
                            <Button variant="contained" fullWidth onClick={handleConfirmBooking} sx={{ bgcolor: PRIMARY_ORANGE, py: 1.5, fontWeight: 'bold', '&:hover': { bgcolor: '#fff', color: '#000' } }}>
                                CONFIRM RESERVATION
                            </Button>
                        </Stack>
                    </Box>
                </Fade>
            </Modal>

            {/* 🔥 TOAST NOTIFICATIONS (Snackbar) */}
            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%', bgcolor: snackbar.severity === 'success' ? '#1b3320' : '#331b1b', color: '#fff', border: `1px solid ${snackbar.severity === 'success' ? '#4caf50' : '#f44336'}`, borderRadius: 1 }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default AgentDashboard;