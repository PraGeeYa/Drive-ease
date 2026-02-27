import React, { useState, useEffect } from 'react';
import { 
    Box, Container, Typography, Grid, Card, CardMedia, CardContent, 
    Button, Stack, Tabs, Tab, Divider, CircularProgress, Chip, 
    Paper // FIXED: Paper component eka import kala
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import SettingsIcon from '@mui/icons-material/Settings';
import PeopleIcon from '@mui/icons-material/People';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CustomerService from '../api/Services/CustomerService'; 

const Fleet = () => {
    const navigate = useNavigate();
    const [category, setCategory] = useState('All');
    const [vehicles, setVehicles] = useState([]); 
    const [loading, setLoading] = useState(true);
    
    const PRIMARY_ORANGE = "#ff5722";
    const DARK_BG = "#000000";
    const HERO_BG = "https://rev-ai.io/wp-content/uploads/2022/03/Transaction-Tracking-and-Analytics-Steering-Car-Rental-banner.webp";

    const fetchFleet = async (selectedCategory) => {
        try {
            setLoading(true);
            const searchType = selectedCategory === 'All' ? '' : selectedCategory;
            const response = await CustomerService.searchVehicles({ 
                type: searchType, 
                days: 1, 
                count: 1 
            });
            setVehicles(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            console.error("Failed to load fleet data", err);
            setVehicles([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFleet(category);
    }, [category]);

    const fadeInUp = {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 }
    };

    return (
        <Box sx={{ bgcolor: DARK_BG, color: '#fff', minHeight: '100vh', pb: 10 }}>
            
            {/* --- 1. HERO HEADER --- */}
            <Box sx={{ 
                position: 'relative',
                py: { xs: 10, md: 15 }, 
                textAlign: 'center', 
                backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.95)), url(${HERO_BG})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
                borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
                <Container maxWidth="md">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                        <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" mb={2}>
                            <DirectionsCarIcon sx={{ color: PRIMARY_ORANGE }} />
                            <Typography variant="h6" color={PRIMARY_ORANGE} fontWeight="800" sx={{ letterSpacing: 6 }}>
                                DRIVEEASE ELITE
                            </Typography>
                        </Stack>
                        <Typography variant="h1" fontWeight="900" sx={{ fontSize: { xs: '3rem', md: '4.5rem' }, textShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                            PREMIUM <span style={{ color: PRIMARY_ORANGE }}>FLEET</span>
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 3, color: 'rgba(255,255,255,0.7)', maxWidth: '600px', mx: 'auto', fontSize: '1.1rem' }}>
                            Precision steering and elite analytics. Choose your perfect companion for the Sri Lankan roads.
                        </Typography>
                    </motion.div>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ mt: -5, position: 'relative', zIndex: 2 }}>
                
                {/* --- 2. GLASS FILTER TABS (Paper used correctly here) --- */}
                <Paper sx={{ 
                    p: 1.5, 
                    bgcolor: 'rgba(20, 20, 20, 0.8)', 
                    backdropFilter: 'blur(10px)',
                    borderRadius: 0,
                    border: '1px solid rgba(255,255,255,0.1)',
                    mb: 8
                }}>
                    <Stack alignItems="center">
                        <Tabs 
                            value={category} 
                            onChange={(e, val) => setCategory(val)} 
                            textColor="inherit" 
                            TabIndicatorProps={{ style: { backgroundColor: PRIMARY_ORANGE, height: 3 } }}
                            sx={{ 
                                '& .MuiTab-root': { fontWeight: '800', fontSize: '0.9rem', letterSpacing: 2, px: { xs: 2, md: 5 }, color: 'rgba(255,255,255,0.5)' },
                                '& .Mui-selected': { color: PRIMARY_ORANGE }
                            }}
                        >
                            <Tab value="All" label="ALL UNITS" />
                            <Tab value="SUV" label="SUVS" />
                            <Tab value="Sedan" label="SEDANS" />
                            <Tab value="Luxury" label="LUXURY" />
                        </Tabs>
                    </Stack>
                </Paper>

                {/* --- 3. LIVE GRID --- */}
                {loading ? (
                    <Box sx={{ textAlign: 'center', py: 15 }}>
                        <CircularProgress sx={{ color: PRIMARY_ORANGE }} />
                        <Typography sx={{ mt: 2, opacity: 0.5, letterSpacing: 2 }}>ANALYZING {category.toUpperCase()} FLEET...</Typography>
                    </Box>
                ) : (
                    <Grid container spacing={4} justifyContent="center">
                        <AnimatePresence mode='wait'>
                            {vehicles.length > 0 ? vehicles.map((car, index) => (
                                <Grid item xs={12} sm={6} md={4} key={car.contractId || car.id || index}>
                                    <motion.div {...fadeInUp} transition={{ delay: index * 0.1 }}>
                                        <Card sx={{ 
                                            borderRadius: 0, 
                                            bgcolor: 'rgba(15, 15, 15, 0.9)', 
                                            backdropFilter: 'blur(5px)',
                                            color: '#fff', 
                                            border: '1px solid rgba(255,255,255,0.05)',
                                            height: '100%', 
                                            display: 'flex', 
                                            flexDirection: 'column',
                                            transition: '0.4s',
                                            '&:hover': { borderColor: PRIMARY_ORANGE, transform: 'translateY(-10px)', boxShadow: `0 10px 30px ${PRIMARY_ORANGE}33` }
                                        }}>
                                            <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                                                <CardMedia 
                                                    component="img" 
                                                    height="260" 
                                                    image={car.imageUrl || "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600"} 
                                                    alt={car.vehicleType}
                                                    sx={{ transition: '0.5s', '&:hover': { scale: 1.1 } }}
                                                />
                                                <Box sx={{ position: 'absolute', top: 0, left: 0, p: 2 }}>
                                                    <Chip label="AVAILABLE" size="small" sx={{ bgcolor: '#1b3320', color: '#4caf50', borderRadius: 0, fontWeight: 'bold', fontSize: '0.7rem' }} />
                                                </Box>
                                                <Chip 
                                                    label={`LKR ${car.finalPrice?.toLocaleString() || '0'} / DAY`}
                                                    sx={{ 
                                                        position: 'absolute', bottom: 20, right: 0, 
                                                        bgcolor: PRIMARY_ORANGE, color: '#fff', fontWeight: '900', borderRadius: 0, px: 1
                                                    }} 
                                                />
                                            </Box>

                                            <CardContent sx={{ p: 4, textAlign: 'center', flexGrow: 1 }}>
                                                <Typography variant="h5" fontWeight="900" mb={1} sx={{ letterSpacing: 1 }}>
                                                    {(car.vehicleType || "Vehicle").toUpperCase()}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 'bold', letterSpacing: 1 }}>
                                                    ENGINEERED BY: {car.providerName || "DRIVEEASE ELITE"}
                                                </Typography>
                                                
                                                <Stack direction="row" justifyContent="center" spacing={4} my={4}>
                                                    <Stack alignItems="center">
                                                        <LocalGasStationIcon sx={{ color: PRIMARY_ORANGE, fontSize: 20, mb: 0.5 }} />
                                                        <Typography variant="caption" sx={{ opacity: 0.6 }}>Hybrid</Typography>
                                                    </Stack>
                                                    <Stack alignItems="center">
                                                        <SettingsIcon sx={{ color: PRIMARY_ORANGE, fontSize: 20, mb: 0.5 }} />
                                                        <Typography variant="caption" sx={{ opacity: 0.6 }}>Tiptronic</Typography>
                                                    </Stack>
                                                    <Stack alignItems="center">
                                                        <PeopleIcon sx={{ color: PRIMARY_ORANGE, fontSize: 20, mb: 0.5 }} />
                                                        <Typography variant="caption" sx={{ opacity: 0.6 }}>Luxury</Typography>
                                                    </Stack>
                                                </Stack>

                                                <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)', mb: 3 }} />

                                                <Button 
                                                    fullWidth variant="contained" 
                                                    onClick={() => navigate('/search-results')}
                                                    sx={{ 
                                                        bgcolor: 'transparent', border: `1px solid ${PRIMARY_ORANGE}`, color: '#fff', 
                                                        borderRadius: 0, py: 1.5, fontWeight: '900', letterSpacing: 2,
                                                        '&:hover': { bgcolor: PRIMARY_ORANGE, color: '#000' }
                                                    }}
                                                >
                                                    BOOK NOW
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </Grid>
                            )) : (
                                <Box sx={{ textAlign: 'center', py: 10, opacity: 0.5 }}>
                                    <Typography variant="h6">No vehicles found in {category}.</Typography>
                                    <Typography variant="body2">Our analytics engine is searching for more units.</Typography>
                                </Box>
                            )}
                        </AnimatePresence>
                    </Grid>
                )}
            </Container>
        </Box>
    );
};

export default Fleet;