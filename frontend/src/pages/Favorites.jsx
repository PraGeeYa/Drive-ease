import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, CardMedia, Button, Container, Paper, Stack, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import WishlistService from '../api/WishlistService';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DateRangeIcon from '@mui/icons-material/DateRange';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LogoutIcon from '@mui/icons-material/Logout';

const Favorites = () => {
    const navigate = useNavigate();
    const [favs, setFavs] = useState([]);

    useEffect(() => {
        setFavs(WishlistService.getFavorites());
    }, []);

    const handleRemove = (vehicle) => {
        const updated = WishlistService.toggleFavorite(vehicle);
        setFavs(updated);
    };

    return (
        <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh', pt: 12 }}>
            {/* SIDEBAR */}
            <Paper elevation={0} sx={{ width: 80, height: '100vh', position: 'fixed', left: 0, top: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4, borderRight: '1px solid #e2e8f0', bgcolor: '#fff', zIndex: 1201 }}>
                <DirectionsCarIcon sx={{ color: '#3b82f6', fontSize: 32, mb: 6 }} />
                <Stack spacing={3}>
                    <IconButton onClick={() => navigate('/agent-dashboard')}><DashboardIcon /></IconButton>
                    <IconButton onClick={() => navigate('/fleet-management')}><DirectionsCarIcon /></IconButton>
                    <IconButton onClick={() => navigate('/booking-history')}><DateRangeIcon /></IconButton>
                    <IconButton color="primary" sx={{ bgcolor: '#3b82f612' }}><FavoriteIcon /></IconButton>
                </Stack>
            </Paper>

            <Box sx={{ flexGrow: 1, ml: '80px', p: 5 }}>
                <Container maxWidth="xl">
                    <Typography variant="h3" fontWeight={1000} mb={5}>Saved <span style={{ color: '#3b82f6' }}>Favorites</span></Typography>

                    {favs.length === 0 ? (
                        <Typography variant="h6" color="text.secondary">No favorite vehicles saved yet.</Typography>
                    ) : (
                        <Grid container spacing={3}>
                            {favs.map((car) => (
                                <Grid item xs={12} md={4} key={car.id}>
                                    <Card sx={{ borderRadius: '24px' }}>
                                        <CardMedia component="img" height="180" image={`https://source.unsplash.com/featured/?${car.vehicleType},car`} />
                                        <CardContent>
                                            <Typography variant="h6" fontWeight={800}>{car.vehicleType} Elite</Typography>
                                            <Typography variant="body2" color="text.secondary" mb={2}>LKR {car.baseRatePerDay?.toLocaleString()} / day</Typography>
                                            <Button fullWidth variant="outlined" color="error" onClick={() => handleRemove(car)} sx={{ borderRadius: '12px' }}>Remove</Button>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Container>
            </Box>
        </Box>
    );
};
export default Favorites;