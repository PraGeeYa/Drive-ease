import React, { useState, useEffect, useMemo } from 'react'; 
import { 
    Box, Container, Grid, Card, CardMedia, CardContent, 
    Typography, Button, Chip, Stack, Skeleton, TextField,
    Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Divider,
    InputAdornment, Slider, Paper
} from '@mui/material';
import SpeedIcon from '@mui/icons-material/Speed';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import SearchIcon from '@mui/icons-material/Search'; 
import SortIcon from '@mui/icons-material/Sort';
import { authService } from '../api/authService';
import apiClient from '../api/axiosConfig';

// 🔥 Custom Component for Card Skeleton
const VehicleCardSkeleton = () => (
    <Grid item xs={12} sm={6} md={4} lg={3}>
        <Card sx={{ borderRadius: '25px', boxShadow: 'none', border: '1px solid #e2e8f0' }}>
            <Skeleton variant="rectangular" height={200} animation="wave" />
            <CardContent sx={{ p: 3 }}>
                <Skeleton variant="text" width="70%" height={30} sx={{ mb: 2 }} />
                <Stack spacing={1} mb={3}>
                    <Skeleton variant="text" width="50%" />
                    <Skeleton variant="text" width="40%" />
                </Stack>
                <Skeleton variant="rectangular" height={45} sx={{ borderRadius: '12px' }} />
            </CardContent>
        </Card>
    </Grid>
);

const FleetPortal = () => {
    const [vehicles, setVehicles] = useState([]);
    const [agents, setAgents] = useState([]); 
    const [loading, setLoading] = useState(true);
    const userRole = authService.getUserRole();
    
    const [searchQuery, setSearchQuery] = useState('');
    const [priceRange, setPriceRange] = useState([0, 100000]); 
    const [sortBy, setSortBy] = useState('none');

    const [openBooking, setOpenBooking] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [bookingData, setBookingData] = useState({ 
        days: 1, customerName: '', customerEmail: '', rentalDate: '', selectedAgentId: '' 
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [fleetRes, agentRes] = await Promise.all([
                    apiClient.get('/admin/vehicles'),
                    apiClient.get('/auth/users') 
                ]);
                setVehicles(fleetRes.data || []);
                setAgents(agentRes.data?.filter(u => u.role === 'AGENT') || []);
            } catch (err) {
                console.error("Data Load Error:", err);
            } finally {
                // Podi delay ekak damma skeleton animation eka lassanata balaganna
                setTimeout(() => setLoading(false), 1000);
            }
        };
        fetchData();
    }, []);

    const filteredVehicles = useMemo(() => {
        let result = vehicles.filter((v) => {
            const vehiclePrice = v.baseRatePerDay || v.finalPrice || 0;
            const matchesSearch = v.vehicleType.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesPrice = vehiclePrice >= priceRange[0] && vehiclePrice <= priceRange[1];
            return matchesSearch && matchesPrice;
        });

        if (sortBy === 'low') {
            result.sort((a, b) => (a.baseRatePerDay || a.finalPrice) - (b.baseRatePerDay || b.finalPrice));
        } else if (sortBy === 'high') {
            result.sort((a, b) => (b.baseRatePerDay || b.finalPrice) - (a.baseRatePerDay || a.finalPrice));
        }

        return result;
    }, [vehicles, searchQuery, priceRange, sortBy]);

    const totalPrice = useMemo(() => {
        if (!selectedVehicle) return 0;
        const rate = selectedVehicle.baseRatePerDay || selectedVehicle.finalPrice || 0;
        return rate * (bookingData.days || 1);
    }, [selectedVehicle, bookingData.days]);

    const handleBookingAction = (vehicle) => {
        setSelectedVehicle(vehicle);
        setOpenBooking(true);
    };

    const submitBooking = async () => {
        try {
            if (!bookingData.customerEmail || !bookingData.selectedAgentId) {
                alert("Please select an agent and provide your email.");
                return;
            }
            const currentUserId = authService.getUserId(); 
            if (!currentUserId) {
                alert("Session expired.");
                return;
            }
            const payload = {
                vehicleId: selectedVehicle.contractId || selectedVehicle.id,
                agentId: bookingData.selectedAgentId,
                customerId: currentUserId,
                customerEmail: bookingData.customerEmail,
                customerName: bookingData.customerName,
                vehicleType: selectedVehicle.vehicleType,
                rentalDays: parseInt(bookingData.days),
                rentalDate: bookingData.rentalDate,
                totalAmount: totalPrice
            };
            await apiClient.post('/booking-requests/submit', payload);
            alert("Booking request submitted!");
            setOpenBooking(false);
        } catch (err) {
            alert("Submission failed.");
        }
    };

    return (
        <Box sx={{ py: 6, bgcolor: '#f4f7fe', minHeight: '100vh' }}>
            <Container maxWidth="xl">
                <Box sx={{ mb: 6, textAlign: 'center' }}>
                    <Typography variant="h3" fontWeight={1000} color="#1b2559">Premium <span style={{ color: '#3b82f6' }}>Fleet</span></Typography>
                    
                    {/* 🔥 Filter Bar Skeleton/Content */}
                    <Paper elevation={0} sx={{ 
                        p: 4, mt: 4, borderRadius: '30px', bgcolor: '#fff', 
                        border: '1px solid #e2e8f0', boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
                        maxWidth: '1000px', mx: 'auto'
                    }}>
                        {loading ? (
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={4}><Skeleton variant="rectangular" height={50} sx={{ borderRadius: '15px' }} /></Grid>
                                <Grid item xs={12} md={3}><Skeleton variant="rectangular" height={50} sx={{ borderRadius: '15px' }} /></Grid>
                                <Grid item xs={12} md={5}><Skeleton variant="text" height={50} /></Grid>
                            </Grid>
                        ) : (
                            <Grid container spacing={3} alignItems="center">
                                <Grid item xs={12} md={4}>
                                    <TextField 
                                        fullWidth placeholder="Search car model..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        InputProps={{
                                            startAdornment: (<InputAdornment position="start"><SearchIcon color="primary" /></InputAdornment>),
                                            sx: { borderRadius: '15px' }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField 
                                        select fullWidth label="Sort by Price" 
                                        value={sortBy} 
                                        onChange={(e) => setSortBy(e.target.value)}
                                        InputProps={{ sx: { borderRadius: '15px' } }}
                                    >
                                        <MenuItem value="none">Recommended</MenuItem>
                                        <MenuItem value="low">Price: Low to High</MenuItem>
                                        <MenuItem value="high">Price: High to Low</MenuItem>
                                    </TextField>
                                </Grid>
                                <Grid item xs={12} md={5}>
                                    <Box sx={{ px: 2 }}>
                                        <Typography variant="caption" fontWeight={800} color="text.secondary">PRICE: LKR {priceRange[0]} - {priceRange[1]}</Typography>
                                        <Slider 
                                            value={priceRange}
                                            onChange={(e, val) => setPriceRange(val)}
                                            min={0} max={100000} step={1000}
                                            valueLabelDisplay="auto"
                                        />
                                    </Box>
                                </Grid>
                            </Grid>
                        )}
                    </Paper>
                </Box>

                <Grid container spacing={4}>
                    {loading ? (
                        // 🔥 Show 8 Skeletons during loading
                        Array.from(new Array(8)).map((_, index) => (
                            <VehicleCardSkeleton key={index} />
                        ))
                    ) : filteredVehicles.length > 0 ? (
                        filteredVehicles.map((v) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={v.contractId || v.id}>
                                <Card sx={{ borderRadius: '25px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', transition: '0.3s', '&:hover': { transform: 'translateY(-10px)' } }}>
                                    <CardMedia component="img" height="200" image={v.imageUrl || 'https://via.placeholder.com/400'} alt={v.vehicleType} />
                                    <CardContent sx={{ p: 3 }}>
                                        <Typography variant="h6" fontWeight={900} color="#1b2559" mb={2}>{v.vehicleType}</Typography>
                                        <Stack spacing={1} mb={3}>
                                            <Stack direction="row" alignItems="center" gap={1}><SpeedIcon color="primary" fontSize="small" /><Typography variant="body2" fontWeight={700}>{v.allowedMileage} km/day</Typography></Stack>
                                            <Stack direction="row" alignItems="center" gap={1}><LocalOfferIcon color="secondary" fontSize="small" /><Typography variant="h6" fontWeight={1000}>LKR {v.baseRatePerDay?.toLocaleString()}</Typography></Stack>
                                        </Stack>
                                        <Button fullWidth variant="contained" disabled={!v.availabilityStatus} onClick={() => handleBookingAction(v)} sx={{ borderRadius: '12px', py: 1.5, fontWeight: 800 }}>Book Now</Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))
                    ) : (
                        <Grid item xs={12} textAlign="center" py={10}>
                            <Typography variant="h5" color="text.secondary" fontWeight={800}>No vehicles found matching filters!</Typography>
                        </Grid>
                    )}
                </Grid>
            </Container>

            {/* Booking Modal Logic Remains the Same */}
            <Dialog open={openBooking} onClose={() => setOpenBooking(false)} PaperProps={{ sx: { borderRadius: '25px', width: 450 } }}>
                <DialogTitle sx={{ fontWeight: 1000 }}>Rental Request</DialogTitle>
                <DialogContent>
                    <Stack spacing={3} mt={1}>
                        <TextField label="Full Name" fullWidth value={bookingData.customerName} onChange={(e) => setBookingData({...bookingData, customerName: e.target.value})} />
                        <TextField label="Email" fullWidth value={bookingData.customerEmail} onChange={(e) => setBookingData({...bookingData, customerEmail: e.target.value})} />
                        <TextField select fullWidth label="Handling Agent" value={bookingData.selectedAgentId} onChange={(e) => setBookingData({...bookingData, selectedAgentId: e.target.value})}>
                            {agents.map((a) => (<MenuItem key={a.userId} value={a.userId}>{a.username}</MenuItem>))}
                        </TextField>
                        <Stack direction="row" spacing={2}>
                            <TextField label="Date" type="date" fullWidth InputLabelProps={{ shrink: true }} value={bookingData.rentalDate} onChange={(e) => setBookingData({...bookingData, rentalDate: e.target.value})} />
                            <TextField label="Days" type="number" fullWidth value={bookingData.days} onChange={(e) => setBookingData({...bookingData, days: e.target.value})} />
                        </Stack>
                        <Divider />
                        <Typography variant="h5" fontWeight={1000} color="secondary" textAlign="right">Total: LKR {totalPrice.toLocaleString()}</Typography>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpenBooking(false)}>Cancel</Button>
                    <Button variant="contained" onClick={submitBooking}>Submit Request</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default FleetPortal;