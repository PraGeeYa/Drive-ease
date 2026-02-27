import React, { useState } from 'react';
import { 
    Container, TextField, Button, Grid, Card, CardContent, Typography, 
    Box, MenuItem, Modal, Fade, Backdrop, Paper, Stack, Divider, Chip, Snackbar, Alert
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion'; 
import { useNavigate } from 'react-router-dom'; 
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SearchIcon from '@mui/icons-material/Search'; // FIXED: Now used below
import EventAvailableIcon from '@mui/icons-material/EventAvailable'; 
import InventoryIcon from '@mui/icons-material/Inventory'; 
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import BookingService from '../api/Services/BookingService'; 

const modalStyle = {
    position: 'absolute', top: '50%', left: '50%',
    transform: 'translate(-50%, -50%)', width: { xs: '90%', sm: 500 },
    bgcolor: 'rgba(26, 26, 26, 0.95)', backdropFilter: 'blur(15px)', borderRadius: 0, 
    boxShadow: '0 25px 50px rgba(0,0,0,0.5)', p: 4,
    color: '#fff', border: '1px solid rgba(255,255,255,0.1)'
};

const AgentDashboard = () => {
    const PRIMARY_ORANGE = "#ff5722"; 
    const DARK_BG = "#000000"; 
    const BG_IMAGE = "https://www.zandxcars.com/wp-content/uploads/2023/05/Smiling-Female-Car-Dealer.jpg";
    const navigate = useNavigate();

    const [searchCriteria, setSearchCriteria] = useState({ type: 'SUV', days: 1, count: 1, pickupDate: '' });
    const [results, setResults] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedContract, setSelectedContract] = useState(null);
    const [customerInfo, setCustomerInfo] = useState({ name: '', requirements: '' });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // --- 🛠️ FUNCTIONS ---
    
    const handleSearch = async () => {
        try {
            const response = await BookingService.searchVehicles(searchCriteria);
            setResults(response.data);
            if (response.data.length === 0) showMessage("No vehicles matches your criteria.", "info");
        } catch (err) { 
            showMessage("Search failed. System offline.", "error");
        }
    };

    const handleOpenModal = (contract) => {
        setSelectedContract(contract);
        setOpen(true);
    };

    const handleConfirmBooking = async () => {
        if (!searchCriteria.pickupDate || !customerInfo.name) {
            showMessage("Validation Error: Name and Date required.", "warning");
            return;
        }

        try {
            const bookingData = {
                contractId: selectedContract.contractId,
                agentId: localStorage.getItem('userId'), 
                customerName: customerInfo.name,
                requirements: customerInfo.requirements,
                rentalDays: searchCriteria.days,
                vehicleCount: searchCriteria.count,
                finalPrice: selectedContract.finalPrice,
                pickupDate: searchCriteria.pickupDate
            };

            await BookingService.createBooking(bookingData);
            showMessage("Success: Booking verified and saved!");
            setOpen(false);
            setCustomerInfo({ name: '', requirements: '' }); 
        } catch (err) { 
            showMessage("Critical: Booking failed to write.", "error");
        }
    };

    const showMessage = (msg, sev = 'success') => setSnackbar({ open: true, message: msg, severity: sev });

    const calculateLogic = (base) => {
        const commission = base * 0.10; 
        return { commission, total: base + commission };
    };

    return (
        <Box sx={{ 
            bgcolor: DARK_BG, 
            minHeight: '100vh', 
            pb: 10, 
            color: '#fff',
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.85)), url(${BG_IMAGE})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
        }}>
            
            {/* --- HERO HEADER --- */}
            <Box sx={{ py: 10, textAlign: 'center' }}>
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" mb={1}>
                        <EventAvailableIcon sx={{ color: PRIMARY_ORANGE, fontSize: 20 }} />
                        <Typography variant="overline" sx={{ color: PRIMARY_ORANGE, letterSpacing: 10, fontWeight: 900 }}>
                            DRIVEEASE ELITE
                        </Typography>
                    </Stack>
                    <Typography variant="h1" fontWeight="900" sx={{ mb: 2, fontSize: { xs: '3rem', md: '4.5rem' }, textShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                        AGENT <span style={{ color: PRIMARY_ORANGE }}>PORTAL</span>
                    </Typography>
                    <Button variant="outlined" startIcon={<InventoryIcon />} onClick={() => navigate('/agent-inventory')}
                        sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)', borderRadius: 0, px: 5, py: 1.5, '&:hover': { borderColor: PRIMARY_ORANGE, color: PRIMARY_ORANGE, bgcolor: 'rgba(255,87,34,0.05)' } }}>
                        ACCESS INVENTORY
                    </Button>
                </motion.div>
            </Box>

            <Container maxWidth="lg">
                {/* --- GLASS SEARCH PANEL --- */}
                <Paper sx={{ 
                    mt: -2, p: 4, 
                    bgcolor: 'rgba(15, 15, 15, 0.85)', 
                    backdropFilter: 'blur(15px)',
                    borderRadius: 0, 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    boxShadow: '0 25px 50px rgba(0,0,0,0.5)' 
                }}>
                    <Grid container spacing={3} alignItems="flex-end">
                        <Grid item xs={12} sm={3}>
                            <Typography variant="caption" sx={{ color: PRIMARY_ORANGE, fontWeight: 900, letterSpacing: 2 }}>CLASS</Typography>
                            <TextField select fullWidth variant="standard" value={searchCriteria.type} onChange={(e) => setSearchCriteria({...searchCriteria, type: e.target.value})} sx={{ input: { color: '#fff' } }} SelectProps={{ sx: { color: '#fff' } }}>
                                <MenuItem value="SUV">SUV</MenuItem>
                                <MenuItem value="Sedan">Sedan</MenuItem>
                                <MenuItem value="Luxury">Luxury Car</MenuItem>
                                <MenuItem value="Hatchback">Hatchback</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={6} sm={2}>
                            <Typography variant="caption" sx={{ color: PRIMARY_ORANGE, fontWeight: 900 }}>DAYS</Typography>
                            <TextField fullWidth type="number" variant="standard" value={searchCriteria.days} onChange={(e) => setSearchCriteria({...searchCriteria, days: e.target.value})} InputProps={{ sx: { color: '#fff' } }} />
                        </Grid>
                        <Grid item xs={6} sm={2}>
                            <Typography variant="caption" sx={{ color: PRIMARY_ORANGE, fontWeight: 900 }}>UNITS</Typography>
                            <TextField fullWidth type="number" variant="standard" value={searchCriteria.count} onChange={(e) => setSearchCriteria({...searchCriteria, count: e.target.value})} InputProps={{ sx: { color: '#fff' } }} />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <Typography variant="caption" sx={{ color: PRIMARY_ORANGE, fontWeight: 900 }}>PICKUP DATE</Typography>
                            <TextField fullWidth type="date" variant="standard" value={searchCriteria.pickupDate} onChange={(e) => setSearchCriteria({...searchCriteria, pickupDate: e.target.value})} InputProps={{ sx: { color: '#fff' } }} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            {/* FIXED: SearchIcon now used as startIcon to clean warning */}
                            <Button variant="contained" fullWidth onClick={handleSearch} startIcon={<SearchIcon />} sx={{ bgcolor: PRIMARY_ORANGE, height: 50, borderRadius: 0, fontWeight: '900', letterSpacing: 1 }}>
                                SEARCH
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>

                {/* --- RESULTS --- */}
                <Box sx={{ mt: 6 }}>
                    <Grid container spacing={4}>
                        <AnimatePresence>
                            {results.map((item) => (
                                <Grid item xs={12} md={4} key={item.contractId}>
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} whileHover={{ y: -10 }}>
                                        <Card sx={{ bgcolor: 'rgba(15, 15, 15, 0.85)', backdropFilter: 'blur(10px)', color: '#fff', borderRadius: 0, border: '1px solid rgba(255,255,255,0.05)' }}>
                                            <Box sx={{ p: 4, textAlign: 'center', bgcolor: 'rgba(0,0,0,0.3)' }}>
                                                <DirectionsCarIcon sx={{ fontSize: 70, color: PRIMARY_ORANGE }} />
                                            </Box>
                                            <CardContent sx={{ p: 3 }}>
                                                <Stack direction="row" justifyContent="space-between" mb={1}>
                                                    <Typography variant="h5" fontWeight="900">{item.vehicleType}</Typography>
                                                    <Chip label="LIVE" size="small" sx={{ bgcolor: '#1b3320', color: '#4caf50', borderRadius: 0, fontWeight: 'bold' }} />
                                                </Stack>
                                                <Typography variant="caption" sx={{ opacity: 0.5, mb: 2, display: 'block' }}>PROVIDER: {item.providerName}</Typography>
                                                <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 2 }} />
                                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                    <Box>
                                                        <Typography variant="caption" sx={{ color: PRIMARY_ORANGE, fontWeight: 900 }}>RATE</Typography>
                                                        <Typography variant="h5" fontWeight="900">LKR {item.finalPrice.toLocaleString()}</Typography>
                                                    </Box>
                                                    <Button variant="outlined" onClick={() => handleOpenModal(item)}
                                                        sx={{ borderColor: PRIMARY_ORANGE, color: PRIMARY_ORANGE, borderRadius: 0, fontWeight: '900', '&:hover': { bgcolor: PRIMARY_ORANGE, color: '#fff' } }}>
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
                </Box>
            </Container>

            {/* --- BOOKING SUMMARY MODAL --- */}
            <Modal open={open} onClose={() => setOpen(false)} closeAfterTransition BackdropComponent={Backdrop} BackdropProps={{ timeout: 500 }}>
                <Fade in={open}>
                    <Box sx={modalStyle}>
                        <Stack direction="row" spacing={2} alignItems="center" mb={4}>
                            <ReceiptLongIcon sx={{ color: PRIMARY_ORANGE, fontSize: 32 }} />
                            <Typography variant="h5" fontWeight="900" sx={{ letterSpacing: 1 }}>BOOKING CONFIRMATION</Typography>
                        </Stack>
                        
                        <Stack spacing={3}>
                            <Box sx={{ p: 3, bgcolor: 'rgba(0,0,0,0.5)', border: '1px solid #333' }}>
                                <Typography variant="caption" sx={{ color: PRIMARY_ORANGE, fontWeight: 900 }}>SELECTED UNIT</Typography>
                                <Typography variant="h6" sx={{ mb: 2 }}>{selectedContract?.vehicleType}</Typography>
                                
                                {selectedContract && (() => {
                                    const base = selectedContract.finalPrice * searchCriteria.days;
                                    const { commission, total } = calculateLogic(base);
                                    return (
                                        <>
                                            <Stack direction="row" justifyContent="space-between" mb={1}>
                                                <Typography variant="body2" sx={{ opacity: 0.6 }}>Rental ({searchCriteria.days} Days)</Typography>
                                                <Typography variant="body2">LKR {base.toLocaleString()}</Typography>
                                            </Stack>
                                            <Stack direction="row" justifyContent="space-between" mb={2}>
                                                <Typography variant="body2" sx={{ color: PRIMARY_ORANGE }}>Service Fee (10%)</Typography>
                                                <Typography variant="body2" sx={{ color: PRIMARY_ORANGE }}>+ LKR {commission.toLocaleString()}</Typography>
                                            </Stack>
                                            <Divider sx={{ borderColor: '#444', my: 1 }} />
                                            <Stack direction="row" justifyContent="space-between">
                                                <Typography variant="h6" fontWeight="900">GRAND TOTAL</Typography>
                                                <Typography variant="h6" fontWeight="900" color={PRIMARY_ORANGE}>LKR {total.toLocaleString()}</Typography>
                                            </Stack>
                                        </>
                                    );
                                })()}
                            </Box>

                            <TextField fullWidth label="Client Name" variant="filled" value={customerInfo.name} onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})} sx={{ bgcolor: '#222', borderRadius: 0 }} InputLabelProps={{ style: { color: '#888' } }} inputProps={{ style: { color: '#fff' } }} />
                            <TextField fullWidth label="Specific Requirements" multiline rows={2} variant="filled" value={customerInfo.requirements} onChange={(e) => setCustomerInfo({...customerInfo, requirements: e.target.value})} sx={{ bgcolor: '#222', borderRadius: 0 }} InputLabelProps={{ style: { color: '#888' } }} inputProps={{ style: { color: '#fff' } }} />
                            
                            <Button variant="contained" fullWidth size="large" onClick={handleConfirmBooking} sx={{ bgcolor: PRIMARY_ORANGE, py: 2, borderRadius: 0, fontWeight: '900', fontSize: '1.1rem' }}>
                                EXECUTE RESERVATION
                            </Button>
                        </Stack>
                    </Box>
                </Fade>
            </Modal>

            {/* --- NOTIFICATIONS --- */}
            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Alert severity={snackbar.severity} sx={{ width: '100%', borderRadius: 0, bgcolor: snackbar.severity === 'success' ? '#1b3320' : '#331b1b', color: '#fff', fontWeight: 'bold', border: `1px solid ${snackbar.severity === 'success' ? '#4caf50' : '#f44336'}` }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default AgentDashboard;