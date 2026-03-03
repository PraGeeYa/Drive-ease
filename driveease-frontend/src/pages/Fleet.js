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

    const fetchFleetData = useCallback(async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/vehicles/available'); 
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
            <Box sx={{ 
                position: 'relative', py: { xs: 8, md: 12 }, textAlign: 'center', 
                backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.95)), url(${HERO_BG})`,
                backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed',
                borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
                <Container maxWidth="md">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                        <Typography variant="h2" fontWeight="900" sx={{ fontSize: { xs: '2.5rem', md: '4rem' } }}>
                            ELITE <span style={{ color: PRIMARY_ORANGE }}>FLEET</span>
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 2, color: 'rgba(255,255,255,0.6)' }}>
                            Premium Selection. Instant Filtering. No Hidden Costs.
                        </Typography>
                    </motion.div>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ mt: -4, position: 'relative', zIndex: 2 }}>
                <Paper sx={{ p: 4, bgcolor: 'rgba(20, 20, 20, 0.95)', backdropFilter: 'blur(10px)', borderRadius: 2, border: '1px solid rgba(255,255,255,0.1)', mb: 4 }}>
                    <Stack spacing={4} alignItems="center"> {/* 🔥 Everything centered here */}
                        
                        {/* 🔍 SEARCH BAR */}
                        <TextField 
                            fullWidth placeholder="Search vehicle name..." 
                            variant="outlined" size="small"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            sx={{ maxWidth: 600 }}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: PRIMARY_ORANGE }} /></InputAdornment>,
                                sx: { 
                                    color: '#fff', 
                                    bgcolor: 'rgba(255,255,255,0.05)', 
                                    borderRadius: 1,
                                    '& input::placeholder': { color: 'rgba(255,255,255,0.8)', opacity: 1 }, // 🔥 Brightened placeholder
                                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' }
                                }
                            }}
                        />

                        {/* 🔥 CENTERED & BRIGHT TABS */}
                        <Box sx={{ width: '100%', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'center' }}>
                            <Tabs 
                                value={category} onChange={(e, val) => setCategory(val)} 
                                variant="scrollable" scrollButtons="auto" 
                                centered
                                TabIndicatorProps={{ style: { backgroundColor: PRIMARY_ORANGE, height: 3 } }}
                                sx={{ 
                                    '& .MuiTab-root': { 
                                        fontWeight: '800', 
                                        fontSize: '0.85rem', 
                                        letterSpacing: 1.5,
                                        color: 'rgba(255,255,255,0.5)', // 🔥 Non-selected visible gray
                                        transition: '0.3s',
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

                        {/* ⚖️ SORT SELECT */}
                        <FormControl size="small" sx={{ minWidth: 200 }}>
                            <Select 
                                value={sortOrder} 
                                onChange={(e) => setSortOrder(e.target.value)}
                                sx={{ 
                                    color: '#fff', 
                                    bgcolor: 'rgba(255,255,255,0.05)',
                                    '& .MuiSelect-icon': { color: PRIMARY_ORANGE }
                                }}
                            >
                                <MenuItem value="none">Sort by: Default</MenuItem>
                                <MenuItem value="low">Price: Low to High</MenuItem>
                                <MenuItem value="high">Price: High to Low</MenuItem>
                            </Select>
                        </FormControl>
                    </Stack>
                </Paper>

                {loading ? (
                    <Box sx={{ textAlign: 'center', py: 15 }}><CircularProgress sx={{ color: PRIMARY_ORANGE }} /></Box>
                ) : (
                    <Grid container spacing={4} justifyContent="center">
                        <AnimatePresence mode='wait'>
                            {processedVehicles.map((car, index) => (
                                <Grid item xs={12} sm={6} md={4} key={car.contractId || index}>
                                    <motion.div {...fadeInUp} transition={{ delay: index * 0.05 }}>
                                        <Card sx={{ 
                                            borderRadius: 2, bgcolor: '#0a0a0a', color: '#fff', border: '1px solid #222',
                                            transition: '0.3s', '&:hover': { borderColor: PRIMARY_ORANGE, transform: 'translateY(-5px)' }
                                        }}>
                                            <Box sx={{ position: 'relative' }}>
                                                <CardMedia component="img" height="220" image={vehicleImages[car.vehicleType] || ""} alt={car.vehicleType} />
                                                <Chip label={`LKR ${car.baseRatePerDay?.toLocaleString()}`} sx={{ position: 'absolute', top: 15, right: 15, bgcolor: PRIMARY_ORANGE, color: '#fff', fontWeight: 'bold', borderRadius: 1 }} />
                                            </Box>

                                            <CardContent sx={{ p: 3 }}>
                                                <Typography variant="h6" fontWeight="800" gutterBottom>{car.vehicleType.toUpperCase()}</Typography>
                                                
                                                <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5, mb: 2, opacity: 0.7 }}>
                                                    <StorefrontIcon sx={{ fontSize: 16, color: PRIMARY_ORANGE }} />
                                                    <Typography variant="caption" fontWeight="600">{car.providerName || "Elite Rentals SL"}</Typography>
                                                </Stack>

                                                <Stack direction="row" spacing={3} sx={{ my: 2, opacity: 0.8 }}>
                                                    <Stack direction="row" alignItems="center" spacing={1}><SettingsIcon sx={{ fontSize: 18, color: PRIMARY_ORANGE }} /><Typography variant="caption">{car.vehicleType.includes('Wagon') ? 'Auto' : 'Manual'}</Typography></Stack>
                                                    <Stack direction="row" alignItems="center" spacing={1}><LocalGasStationIcon sx={{ fontSize: 18, color: PRIMARY_ORANGE }} /><Typography variant="caption">{car.vehicleType.includes('Hybrid') ? 'Hybrid' : 'Petrol'}</Typography></Stack>
                                                    <Stack direction="row" alignItems="center" spacing={1}><PeopleIcon sx={{ fontSize: 18, color: PRIMARY_ORANGE }} /><Typography variant="caption">5 Seats</Typography></Stack>
                                                </Stack>

                                                <Divider sx={{ borderColor: '#222', mb: 2 }} />
                                                <Button 
                                                    fullWidth variant="outlined" 
                                                    onClick={() => navigate('/search-results')}
                                                    sx={{ borderColor: PRIMARY_ORANGE, color: PRIMARY_ORANGE, fontWeight: 'bold', borderRadius: 1, '&:hover': { bgcolor: PRIMARY_ORANGE, color: '#000' } }}
                                                >
                                                    BOOK NOW
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </Grid>
                            ))}
                        </AnimatePresence>
                    </Grid>
                )}
            </Container>
        </Box>
    );
};

export default Fleet;