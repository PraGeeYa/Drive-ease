import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
    Box, Container, Typography, Grid, Card, CardMedia, CardContent, 
    Button, Stack, Tabs, Tab, Divider, CircularProgress, Chip, 
    Paper, TextField, InputAdornment, MenuItem, Select, FormControl
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import SettingsIcon from '@mui/icons-material/Settings';
import PeopleIcon from '@mui/icons-material/People';
import StorefrontIcon from '@mui/icons-material/Storefront';
import NoCrashIcon from '@mui/icons-material/NoCrash'; // Status icon
import apiClient from '../api/apiClient';

const Fleet = () => {
    const navigate = useNavigate();
    const [category, setCategory] = useState('All');
    const [vehicles, setVehicles] = useState([]); 
    const [availableCategories, setAvailableCategories] = useState(['All']); 
    const [loading, setLoading] = useState(true);
    const [vehicleImages, setVehicleImages] = useState({});
    
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState("none");

    const PRIMARY_ORANGE = "#ff5722";
    const DARK_BG = "#000000";
    const HERO_BG = "https://rev-ai.io/wp-content/uploads/2022/03/Transaction-Tracking-and-Analytics-Steering-Car-Rental-banner.webp";

    const getVehicleImage = (vehicleName) => {
        return `https://loremflickr.com/800/600/${encodeURIComponent(vehicleName + " car")}`;
    };

    // FETCH FLEET DATA (Includes both Available and Rented for Display)
    const fetchFleetData = useCallback(async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/vehicles/available'); // Assuming backend returns based on logic
            const allVehicles = Array.isArray(response.data) ? response.data : [];
            setVehicles(allVehicles);

            const uniqueTypes = [...new Set(allVehicles.map(v => v.vehicleType))];
            setAvailableCategories(['All', ...uniqueTypes]);

            const imageMap = {};
            allVehicles.forEach(vehicle => {
                if (!imageMap[vehicle.vehicleType]) {
                    imageMap[vehicle.vehicleType] = getVehicleImage(vehicle.vehicleType);
                }
            });
            setVehicleImages(imageMap);

        } catch (err) {
            console.error("Failed to load fleet data", err);
            setVehicles([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFleetData();
    }, [fetchFleetData]);

    const processedVehicles = useMemo(() => {
        let result = [...vehicles];
        if (category !== 'All') {
            result = result.filter(v => v.vehicleType === category);
        }
        if (searchQuery) {
            result = result.filter(v => 
                v.vehicleType.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        if (sortOrder === "low") result.sort((a, b) => a.baseRatePerDay - b.baseRatePerDay);
        if (sortOrder === "high") result.sort((a, b) => b.baseRatePerDay - a.baseRatePerDay);
        return result;
    }, [vehicles, category, searchQuery, sortOrder]);

    const fadeInUp = {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 }
    };

    return (
        <Box sx={{ bgcolor: DARK_BG, color: '#fff', minHeight: '100vh', pb: 10 }}>
            {/* --- HERO SECTION --- */}
            <Box sx={{ 
                position: 'relative', py: { xs: 8, md: 12 }, textAlign: 'center', 
                backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.95)), url(${HERO_BG})`,
                backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed',
                borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
                <Container maxWidth="md">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                        <Typography variant="h2" fontWeight="900" sx={{ fontSize: { xs: '2.5rem', md: '4rem' }, letterSpacing: -1 }}>
                            ELITE <span style={{ color: PRIMARY_ORANGE }}>FLEET</span>
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 2, color: 'rgba(255,255,255,0.6)', letterSpacing: 2, fontWeight: 500 }}>
                            Premium Selection. Instant Filtering. No Hidden Costs.
                        </Typography>
                    </motion.div>
                </Container>
            </Box>

            {/* --- CONTROL BAR --- */}
            <Container maxWidth="lg" sx={{ mt: -4, position: 'relative', zIndex: 2 }}>
                <Paper sx={{ p: 4, bgcolor: 'rgba(15, 15, 15, 0.98)', backdropFilter: 'blur(10px)', borderRadius: 2, border: '1px solid rgba(255,255,255,0.1)', mb: 4, boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
                    <Stack spacing={4} alignItems="center">
                        <TextField 
                            fullWidth placeholder="Search vehicle models (e.g. Toyota, Prius)..." 
                            variant="outlined" size="small"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            sx={{ maxWidth: 600 }}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: PRIMARY_ORANGE }} /></InputAdornment>,
                                sx: { 
                                    color: '#fff', 
                                    bgcolor: 'rgba(255,255,255,0.03)', 
                                    borderRadius: 1,
                                    '& input::placeholder': { color: 'rgba(255,255,255,0.7)', opacity: 1 },
                                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' }
                                }
                            }}
                        />

                        <Box sx={{ width: '100%', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'center' }}>
                            <Tabs 
                                value={category} onChange={(e, val) => setCategory(val)} 
                                variant="scrollable" scrollButtons="auto" 
                                centered
                                TabIndicatorProps={{ style: { backgroundColor: PRIMARY_ORANGE, height: 3 } }}
                                sx={{ 
                                    '& .MuiTab-root': { 
                                        fontWeight: '800', fontSize: '0.85rem', letterSpacing: 1.5,
                                        color: 'rgba(255,255,255,0.4)', transition: '0.3s',
                                        '&:hover': { color: '#fff' }
                                    },
                                    '& .Mui-selected': { color: `${PRIMARY_ORANGE} !important` }
                                }}
                            >
                                {availableCategories.map((cat) => (
                                    <Tab key={cat} value={cat} label={cat.toUpperCase()} />
                                ))}
                            </Tabs>
                        </Box>

                        <FormControl size="small" sx={{ minWidth: 220 }}>
                            <Select 
                                value={sortOrder} 
                                onChange={(e) => setSortOrder(e.target.value)}
                                sx={{ 
                                    color: '#fff', bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 1,
                                    '& .MuiSelect-icon': { color: PRIMARY_ORANGE },
                                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' }
                                }}
                            >
                                <MenuItem value="none">Sort by: Default</MenuItem>
                                <MenuItem value="low">Price: Low to High</MenuItem>
                                <MenuItem value="high">Price: High to Low</MenuItem>
                            </Select>
                        </FormControl>
                    </Stack>
                </Paper>

                {/* --- VEHICLE GRID --- */}
                {loading ? (
                    <Box sx={{ textAlign: 'center', py: 15 }}><CircularProgress sx={{ color: PRIMARY_ORANGE }} /></Box>
                ) : (
                    <Grid container spacing={4} justifyContent="center">
                        <AnimatePresence mode='wait'>
                            {processedVehicles.map((car, index) => {
                                // Logic to check availability based on backend boolean
                                const isAvailable = car.availabilityStatus; 

                                return (
                                    <Grid item xs={12} sm={6} md={4} key={car.contractId || index}>
                                        <motion.div {...fadeInUp} transition={{ delay: index * 0.05 }}>
                                            <Card sx={{ 
                                                borderRadius: 2, bgcolor: '#0a0a0a', color: '#fff', border: '1px solid #222',
                                                transition: '0.4s', position: 'relative',
                                                filter: isAvailable ? 'none' : 'grayscale(0.8) opacity(0.7)', // Grayscale if rented
                                                '&:hover': { borderColor: isAvailable ? PRIMARY_ORANGE : '#222', transform: isAvailable ? 'translateY(-8px)' : 'none' }
                                            }}>
                                                {/* PRICE CHIP */}
                                                <Chip 
                                                    label={`LKR ${car.baseRatePerDay?.toLocaleString()}`} 
                                                    sx={{ 
                                                        position: 'absolute', top: 15, right: 15, zIndex: 3,
                                                        bgcolor: isAvailable ? PRIMARY_ORANGE : '#555', color: '#fff', fontWeight: 'bold', borderRadius: 1 
                                                    }} 
                                                />

                                                {/* AVAILABILITY OVERLAY */}
                                                {!isAvailable && (
                                                    <Box sx={{ position: 'absolute', top: '25%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 10, bgcolor: 'rgba(0,0,0,0.8)', px: 3, py: 1, border: '2px solid #555' }}>
                                                        <Typography variant="h6" fontWeight="900" sx={{ letterSpacing: 2, color: '#aaa' }}>RENTED</Typography>
                                                    </Box>
                                                )}

                                                <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                                                    <CardMedia component="img" height="220" image={vehicleImages[car.vehicleType] || ""} alt={car.vehicleType} sx={{ transition: '0.5s', '&:hover': { transform: isAvailable ? 'scale(1.1)' : 'none' } }} />
                                                </Box>

                                                <CardContent sx={{ p: 3 }}>
                                                    <Typography variant="h6" fontWeight="800" gutterBottom sx={{ letterSpacing: 1 }}>{car.vehicleType.toUpperCase()}</Typography>
                                                    
                                                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5, mb: 3, opacity: 0.6 }}>
                                                        <StorefrontIcon sx={{ fontSize: 16, color: isAvailable ? PRIMARY_ORANGE : '#555' }} />
                                                        <Typography variant="caption" fontWeight="600">{car.provider?.providerName || "Elite Rentals SL"}</Typography>
                                                    </Stack>

                                                    <Stack direction="row" justifyContent="space-between" sx={{ my: 2, opacity: 0.8 }}>
                                                        <Stack direction="row" alignItems="center" spacing={1}><SettingsIcon sx={{ fontSize: 16, color: PRIMARY_ORANGE }} /><Typography variant="caption">Auto</Typography></Stack>
                                                        <Stack direction="row" alignItems="center" spacing={1}><LocalGasStationIcon sx={{ fontSize: 16, color: PRIMARY_ORANGE }} /><Typography variant="caption">Hybrid</Typography></Stack>
                                                        <Stack direction="row" alignItems="center" spacing={1}><PeopleIcon sx={{ fontSize: 16, color: PRIMARY_ORANGE }} /><Typography variant="caption">5 Seats</Typography></Stack>
                                                    </Stack>

                                                    <Divider sx={{ borderColor: '#222', mb: 2.5 }} />

                                                    {isAvailable ? (
                                                        <Button 
                                                            fullWidth variant="contained" 
                                                            onClick={() => navigate(`/search-results`)}
                                                            sx={{ bgcolor: PRIMARY_ORANGE, color: '#fff', fontWeight: 'bold', py: 1.2, borderRadius: 1, '&:hover': { bgcolor: '#fff', color: '#000' } }}
                                                        >
                                                            BOOK NOW
                                                        </Button>
                                                    ) : (
                                                        <Button 
                                                            disabled fullWidth variant="outlined" 
                                                            sx={{ borderColor: '#333 !important', color: '#555 !important', py: 1.2, borderRadius: 1 }}
                                                        >
                                                            UNAVAILABLE
                                                        </Button>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    </Grid>
                                );
                            })}
                        </AnimatePresence>
                    </Grid>
                )}
                
                {!loading && processedVehicles.length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 10 }}>
                        <NoCrashIcon sx={{ fontSize: 60, opacity: 0.2, mb: 2 }} />
                        <Typography variant="h6" sx={{ opacity: 0.5 }}>No vehicles found matching your criteria.</Typography>
                    </Box>
                )}
            </Container>
        </Box>
    );
};

export default Fleet;