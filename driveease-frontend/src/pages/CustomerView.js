import React, { useState, useEffect, useCallback } from 'react';
import { 
    Container, TextField, Button, Grid, Card, CardContent, Typography, 
    Box, MenuItem, Modal, Select, InputLabel, FormControl, Paper, Stack, Divider, Chip, Backdrop, Fade
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SearchIcon from '@mui/icons-material/Search';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import CustomerService from '../api/Services/CustomerService'; 

const modalStyle = {
    position: 'absolute', top: '50%', left: '50%',
    transform: 'translate(-50%, -50%)', width: { xs: '90%', sm: 450 },
    bgcolor: 'rgba(15, 15, 15, 0.95)', backdropFilter: 'blur(20px)', borderRadius: 0, 
    boxShadow: '0 25px 60px rgba(0,0,0,0.8)', p: 4, color: '#fff',
    border: '1px solid rgba(255,255,255,0.1)'
};

const CustomerView = () => {
    const PRIMARY_ORANGE = "#ff5722";
    const DARK_BG = "#000000";
    const BG_IMAGE = "https://www.revv.co.in/blogs/wp-content/uploads/2024/11/young-sales-woman-carshowroom-standing-by-car-1024x683.jpg";

    const [searchCriteria, setSearchCriteria] = useState({ type: 'SUV', days: 1, count: 1 });
    const [results, setResults] = useState([]);
    const [agents, setAgents] = useState([]); 
    const [open, setOpen] = useState(false);
    const [selectedContract, setSelectedContract] = useState(null);
    const [selectedAgent, setSelectedAgent] = useState('');

    const fetchAgents = useCallback(async () => {
        try {
            const res = await CustomerService.getSupportAgents();
            setAgents(res.data || []);
        } catch (err) {
            console.error("Failed to load agents", err);
        }
    }, []);

    useEffect(() => {
        fetchAgents();
    }, [fetchAgents]);

    const handleSearch = async () => {
        try {
            const response = await CustomerService.searchVehicles(searchCriteria);
            setResults(response.data || []);
        } catch (err) { 
            console.error("Search failed", err);
        }
    };

    const handleOpenModal = (contract) => {
        setSelectedContract(contract);
        setOpen(true);
    };

    const handleSendRequest = async () => {
        if (!selectedAgent) {
            alert("Please select an agent first!");
            return;
        }

        const customerId = localStorage.getItem('userId'); 
        const bookingRequestData = {
            customerId: customerId,
            agentId: selectedAgent,
            contractId: selectedContract.contractId,
            vehicleType: selectedContract.vehicleType,
            finalPrice: selectedContract.finalPrice
        };

        try {
            const res = await CustomerService.sendBookingRequest(bookingRequestData);
            if(res.status === 200) {
                const agentObj = agents.find(a => a.userId === selectedAgent);
                alert(`Request for ${selectedContract.vehicleType} sent successfully to ${agentObj.username}!`);
                setOpen(false);
                setSelectedAgent('');
            }
        } catch (err) {
            alert("Error: Database connection issue.");
        }
    };

    return (
        <Box sx={{ 
            bgcolor: DARK_BG, 
            minHeight: '100vh', 
            pb: 10, 
            color: '#fff',
            // --- Global Background Styling ---
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.75), rgba(0,0,0,0.9)), url(${BG_IMAGE})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
        }}>
            
            {/* --- HERO HEADER --- */}
            <Box sx={{ py: 12, textAlign: 'center' }}>
                <Container maxWidth="md">
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                        <Typography variant="overline" sx={{ color: PRIMARY_ORANGE, letterSpacing: 8, fontWeight: 900 }}>
                            PREMIUM BUSINESS RENTALS
                        </Typography>
                        <Typography variant="h1" fontWeight="900" sx={{ mt: 1, mb: 2, fontSize: { xs: '3rem', md: '5rem' }, textShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                            ELITE <span style={{ color: PRIMARY_ORANGE }}>CONCIERGE</span>
                        </Typography>
                        <Typography variant="h6" sx={{ opacity: 0.7, maxWidth: '600px', mx: 'auto', fontWeight: '400' }}>
                            Lease or rent. Select your vehicle class and connect with a personal handler to execute your request.
                        </Typography>
                    </motion.div>
                </Container>
            </Box>

            <Container maxWidth="lg">
                {/* --- GLASS SEARCH PANEL --- */}
                <Paper elevation={0} sx={{ 
                    mt: -2, p: 4, mb: 8, borderRadius: 0, 
                    bgcolor: 'rgba(20, 20, 20, 0.85)', 
                    backdropFilter: 'blur(15px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 25px 50px rgba(0,0,0,0.6)'
                }}>
                    <Grid container spacing={3} alignItems="flex-end">
                        <Grid item xs={12} sm={3}>
                            <Typography variant="caption" sx={{ color: PRIMARY_ORANGE, fontWeight: 900, letterSpacing: 2 }}>FLEET CLASS</Typography>
                            <TextField select fullWidth variant="standard" value={searchCriteria.type}
                                onChange={(e) => setSearchCriteria({...searchCriteria, type: e.target.value})}
                                sx={{ input: { color: '#fff' } }} SelectProps={{ sx: { color: '#fff' } }}>
                                <MenuItem value="SUV">SUV</MenuItem>
                                <MenuItem value="Sedan">Sedan</MenuItem>
                                <MenuItem value="Luxury">Luxury Business</MenuItem>
                                <MenuItem value="Hatchback">Compact</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={6} sm={2}>
                            <Typography variant="caption" sx={{ color: PRIMARY_ORANGE, fontWeight: 900 }}>DURATION</Typography>
                            <TextField fullWidth type="number" variant="standard" value={searchCriteria.days} 
                                onChange={(e) => setSearchCriteria({...searchCriteria, days: e.target.value})}
                                InputProps={{ sx: { color: '#fff' } }} />
                        </Grid>
                        <Grid item xs={6} sm={2}>
                            <Typography variant="caption" sx={{ color: PRIMARY_ORANGE, fontWeight: 900 }}>UNITS</Typography>
                            <TextField fullWidth type="number" variant="standard" value={searchCriteria.count} 
                                onChange={(e) => setSearchCriteria({...searchCriteria, count: e.target.value})}
                                InputProps={{ sx: { color: '#fff' } }} />
                        </Grid>
                        <Grid item xs={12} sm={5}>
                            <Button variant="contained" fullWidth onClick={handleSearch} 
                                sx={{ bgcolor: PRIMARY_ORANGE, height: '55px', borderRadius: 0, fontWeight: '900', fontSize: '1rem', letterSpacing: 1 }}
                                startIcon={<SearchIcon />}>
                                EXECUTE SEARCH
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>

                {/* --- RESULTS SECTION --- */}
                <Grid container spacing={4}>
                    <AnimatePresence>
                        {results.map((item) => (
                            <Grid item xs={12} sm={6} md={4} key={item.contractId}>
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} whileHover={{ y: -10 }}>
                                    <Card sx={{ 
                                        borderRadius: 0, bgcolor: 'rgba(15, 15, 15, 0.9)', border: '1px solid rgba(255,255,255,0.05)', color: '#fff',
                                        backdropFilter: 'blur(10px)', transition: '0.4s', '&:hover': { borderColor: PRIMARY_ORANGE, boxShadow: `0 10px 30px ${PRIMARY_ORANGE}22` } 
                                    }}>
                                        <Box sx={{ bgcolor: 'rgba(0,0,0,0.3)', py: 5, textAlign: 'center' }}>
                                            <DirectionsCarIcon sx={{ fontSize: 70, color: PRIMARY_ORANGE }} />
                                        </Box>
                                        <CardContent sx={{ p: 4 }}>
                                            <Stack direction="row" justifyContent="space-between" mb={1}>
                                                <Typography variant="h5" fontWeight="900" sx={{ letterSpacing: 1 }}>{item.vehicleType}</Typography>
                                                <Chip label="LIVE" size="small" sx={{ bgcolor: '#1b3320', color: '#4caf50', borderRadius: 0, fontWeight: 'bold' }} />
                                            </Stack>
                                            <Typography variant="caption" sx={{ opacity: 0.5, letterSpacing: 1 }}>PROVIDER: {item.providerName}</Typography>
                                            
                                            <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)', my: 3 }} />
                                            
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Box>
                                                    <Typography variant="caption" sx={{ color: PRIMARY_ORANGE, fontWeight: 900 }}>TOTAL QUOTE</Typography>
                                                    <Typography variant="h4" fontWeight="900">LKR {item.finalPrice.toLocaleString()}</Typography>
                                                </Box>
                                                <Button variant="outlined" onClick={() => handleOpenModal(item)}
                                                    sx={{ borderColor: PRIMARY_ORANGE, color: PRIMARY_ORANGE, borderRadius: 0, fontWeight: '900', px: 3, '&:hover': { bgcolor: PRIMARY_ORANGE, color: '#fff' } }}>
                                                    BOOK
                                                </Button>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </Grid>
                        ))}
                    </AnimatePresence>
                </Grid>
            </Container>

            {/* --- AGENT SELECTION MODAL (Glass Theme) --- */}
            <Modal open={open} onClose={() => setOpen(false)} closeAfterTransition BackdropComponent={Backdrop} BackdropProps={{ timeout: 500 }}>
                <Fade in={open}>
                    <Box sx={modalStyle}>
                        <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                            <SupportAgentIcon sx={{ color: PRIMARY_ORANGE, fontSize: 32 }} />
                            <Typography variant="h5" fontWeight="900" sx={{ letterSpacing: 1 }}>ASSIGN HANDLER</Typography>
                        </Stack>
                        
                        <Typography variant="body2" sx={{ opacity: 0.6, mb: 4, lineHeight: 1.6 }}>
                            Choose an authorized Support Agent to oversee your reservation for <b style={{ color: PRIMARY_ORANGE }}>{selectedContract?.vehicleType}</b>.
                        </Typography>

                        <FormControl fullWidth variant="filled" sx={{ mb: 4, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 0 }}>
                            <InputLabel sx={{ color: PRIMARY_ORANGE, fontWeight: 'bold' }}>Authorized Agents</InputLabel>
                            <Select value={selectedAgent} onChange={(e) => setSelectedAgent(e.target.value)} sx={{ color: '#fff' }}>
                                {agents.map((agent) => (
                                    <MenuItem key={agent.userId} value={agent.userId}>
                                        <Stack direction="row" alignItems="center">
                                            <VerifiedUserIcon sx={{ mr: 1, fontSize: 18, color: PRIMARY_ORANGE }} />
                                            {agent.username}
                                        </Stack>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Button variant="contained" fullWidth onClick={handleSendRequest}
                            sx={{ bgcolor: PRIMARY_ORANGE, py: 2, fontWeight: '900', borderRadius: 0, fontSize: '1rem', '&:hover': { bgcolor: '#fff', color: '#000' } }}>
                            SEND RESERVATION REQUEST
                        </Button>
                    </Box>
                </Fade>
            </Modal>
        </Box>
    );
};

export default CustomerView;