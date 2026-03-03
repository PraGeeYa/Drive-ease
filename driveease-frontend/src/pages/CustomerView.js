import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
    Container, TextField, Button, Grid, Card, CardContent, Typography, 
    Box, MenuItem, Modal, Select, InputLabel, FormControl, Paper, Stack, Divider, Chip, Backdrop, Fade, CardMedia,
    CircularProgress, Snackbar, Alert // 🔥 Snackbar saha Alert add kala
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import SearchIcon from '@mui/icons-material/Search';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import CustomerService from '../api/Services/CustomerService'; 
import apiClient from '../api/apiClient';

const modalStyle = {
    position: 'absolute', top: '50%', left: '50%',
    transform: 'translate(-50%, -50%)', width: { xs: '90%', sm: 450 },
    bgcolor: 'rgba(10, 10, 10, 0.98)', backdropFilter: 'blur(20px)', borderRadius: 2, 
    boxShadow: '0 25px 60px rgba(0,0,0,0.8)', p: 4, color: '#fff',
    border: '1px solid rgba(255,87,34,0.2)'
};

const CustomerView = () => {
    const PRIMARY_ORANGE = "#ff5722";
    const DARK_BG = "#000000";
    const BG_IMAGE = "https://rev-ai.io/wp-content/uploads/2022/03/Transaction-Tracking-and-Analytics-Steering-Car-Rental-banner.webp";

    const [searchCriteria, setSearchCriteria] = useState({ type: 'ALL', days: 1, date: '' });
    const [vehicles, setVehicles] = useState([]);
    const [agents, setAgents] = useState([]); 
    const [open, setOpen] = useState(false);
    const [selectedContract, setSelectedContract] = useState(null);
    const [selectedAgent, setSelectedAgent] = useState('');
    const [loading, setLoading] = useState(true);

    // 🔥 Toast Notification State
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const getVehicleImage = (vehicleName) => {
        return `https://loremflickr.com/800/600/${encodeURIComponent(vehicleName + " car")}`;
    };

    const showToast = (msg, sev = 'success') => setSnackbar({ open: true, message: msg, severity: sev });

    const fetchInitialData = useCallback(async () => {
        try {
            setLoading(true);
            const [vRes, aRes] = await Promise.all([
                apiClient.get('/vehicles/available'),
                CustomerService.getSupportAgents()
            ]);
            setVehicles(vRes.data || []);
            setAgents(aRes.data || []);
        } catch (err) {
            showToast("Failed to sync live inventory data.", "error");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchInitialData();
    }, [fetchInitialData]);

    const filteredResults = useMemo(() => {
        if (searchCriteria.type === 'ALL') return vehicles;
        return vehicles.filter(v => v.vehicleType === searchCriteria.type);
    }, [vehicles, searchCriteria.type]);

    const handleOpenModal = (contract) => {
        setSelectedContract(contract);
        setOpen(true);
    };

    const handleSendRequest = async () => {
        if (!selectedAgent || !searchCriteria.date) {
            showToast("Please complete handler and date selection!", "warning");
            return;
        }

        const bookingRequestData = {
            customerId: localStorage.getItem('userId'),
            agentId: selectedAgent,
            contractId: selectedContract.contractId,
            vehicleType: selectedContract.vehicleType,
            finalPrice: selectedContract.baseRatePerDay * searchCriteria.days,
            pickupDate: searchCriteria.date 
        };

        try {
            const res = await CustomerService.sendBookingRequest(bookingRequestData);
            if(res.status === 200) {
                showToast(`Request for ${selectedContract.vehicleType} sent successfully!`);
                setOpen(false);
                setSelectedAgent('');
            }
        } catch (err) {
            showToast("Critical Error: Database connection failed.", "error");
        }
    };

    const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

    return (
        <Box sx={{ 
            bgcolor: DARK_BG, minHeight: '100vh', pb: 10, color: '#fff',
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0.95)), url(${BG_IMAGE})`,
            backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'
        }}>
            
            <Box sx={{ py: { xs: 8, md: 12 }, textAlign: 'center' }}>
                <Container maxWidth="md">
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                        <Typography variant="overline" sx={{ color: PRIMARY_ORANGE, letterSpacing: 8, fontWeight: 900 }}>
                            PREMIUM BUSINESS RENTALS
                        </Typography>
                        <Typography variant="h2" fontWeight="900" sx={{ mt: 1, mb: 2, fontSize: { xs: '2.5rem', md: '4.5rem' } }}>
                            ELITE <span style={{ color: PRIMARY_ORANGE }}>CONCIERGE</span>
                        </Typography>
                        <Typography variant="body1" sx={{ opacity: 0.6, maxWidth: '600px', mx: 'auto' }}>
                            Select your fleet class and connect with a personal handler to execute your request.
                        </Typography>
                    </motion.div>
                </Container>
            </Box>

            <Container maxWidth="lg">
                <Paper sx={{ 
                    p: 4, mb: 8, borderRadius: 2, bgcolor: 'rgba(20, 20, 20, 0.9)', backdropFilter: 'blur(15px)',
                    border: '1px solid rgba(255,255,255,0.1)'
                }}>
                    <Grid container spacing={3} alignItems="center">
                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth variant="outlined" size="small">
                                <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>FLEET CLASS</InputLabel>
                                <Select 
                                    label="FLEET CLASS"
                                    value={searchCriteria.type}
                                    onChange={(e) => setSearchCriteria({...searchCriteria, type: e.target.value})}
                                    sx={{ color: '#fff', '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }}
                                >
                                    <MenuItem value="ALL">All Available</MenuItem>
                                    {[...new Set(vehicles.map(v => v.vehicleType))].map((type) => (
                                        <MenuItem key={type} value={type}>{type}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <TextField 
                                fullWidth type="date" label="PICKUP DATE" size="small"
                                InputLabelProps={{ shrink: true }}
                                value={searchCriteria.date}
                                onChange={(e) => setSearchCriteria({...searchCriteria, date: e.target.value})}
                                InputProps={{ sx: { color: '#fff' } }}
                                sx={{ '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <TextField 
                                fullWidth type="number" label="DAYS" size="small"
                                value={searchCriteria.days}
                                onChange={(e) => setSearchCriteria({...searchCriteria, days: e.target.value})}
                                InputProps={{ sx: { color: '#fff' } }}
                                sx={{ '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <Button variant="contained" fullWidth onClick={fetchInitialData} sx={{ bgcolor: PRIMARY_ORANGE, height: '45px', fontWeight: 'bold' }} startIcon={<SearchIcon />}>
                                REFRESH LIST
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
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -10 }}>
                                        <Card sx={{ borderRadius: 2, bgcolor: '#0a0a0a', border: '1px solid #222', color: '#fff', transition: '0.4s' }}>
                                            <Box sx={{ position: 'relative' }}>
                                                <CardMedia component="img" height="200" image={getVehicleImage(item.vehicleType)} />
                                                <Chip label="AVAILABLE" size="small" sx={{ position: 'absolute', top: 15, left: 15, bgcolor: '#1b3320', color: '#4caf50', borderRadius: 1, fontWeight: 'bold' }} />
                                            </Box>
                                            <CardContent sx={{ p: 3 }}>
                                                <Typography variant="h5" fontWeight="900">{item.vehicleType.toUpperCase()}</Typography>
                                                <Typography variant="caption" sx={{ opacity: 0.5 }}>DAILY RATE: LKR {item.baseRatePerDay?.toLocaleString()}</Typography>
                                                <Divider sx={{ borderColor: '#222', my: 2 }} />
                                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                    <Box>
                                                        <Typography variant="caption" sx={{ color: PRIMARY_ORANGE, fontWeight: 900 }}>TOTAL QUOTE</Typography>
                                                        <Typography variant="h5" fontWeight="900">LKR {(item.baseRatePerDay * searchCriteria.days).toLocaleString()}</Typography>
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
                            <SupportAgentIcon sx={{ color: PRIMARY_ORANGE, fontSize: 32 }} />
                            <Typography variant="h5" fontWeight="900">ASSIGN HANDLER</Typography>
                        </Stack>
                        <Typography variant="body2" sx={{ opacity: 0.7, mb: 4 }}>
                            Assign a verified agent for your <b style={{ color: PRIMARY_ORANGE }}>{selectedContract?.vehicleType}</b> booking on {searchCriteria.date || 'TBD'}.
                        </Typography>
                        <FormControl fullWidth sx={{ mb: 4 }}>
                            <InputLabel sx={{ color: PRIMARY_ORANGE }}>Authorized Agents</InputLabel>
                            <Select value={selectedAgent} label="Authorized Agents" onChange={(e) => setSelectedAgent(e.target.value)} sx={{ color: '#fff', '.MuiOutlinedInput-notchedOutline': { borderColor: PRIMARY_ORANGE } }}>
                                {agents.map((agent) => (
                                    <MenuItem key={agent.userId} value={agent.userId}>
                                        <VerifiedUserIcon sx={{ mr: 1, fontSize: 18, color: PRIMARY_ORANGE }} /> {agent.username}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button variant="contained" fullWidth onClick={handleSendRequest} sx={{ bgcolor: PRIMARY_ORANGE, py: 1.5, fontWeight: 'bold', '&:hover': { bgcolor: '#fff', color: '#000' } }}>
                            SEND REQUEST
                        </Button>
                    </Box>
                </Fade>
            </Modal>

            {/* 🔥 TOAST NOTIFICATIONS */}
            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%', bgcolor: snackbar.severity === 'success' ? '#1b3320' : '#331b1b', color: '#fff', border: `1px solid ${snackbar.severity === 'success' ? '#4caf50' : '#f44336'}`, borderRadius: 1 }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default CustomerView;