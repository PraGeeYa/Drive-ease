import React, { useState, useEffect } from 'react';
import { 
    Container, Typography, Paper, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Chip, Box, Stack 
} from '@mui/material';
import { motion } from 'framer-motion';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import HistoryIcon from '@mui/icons-material/History';
import CustomerService from '../api/Services/CustomerService'; 

const MyBookings = () => {
    // Brand Color Configuration
    const PRIMARY_ORANGE = "#ff5722";
    const DARK_BG = "#000000";
    // Custom Background Image from the provided link
    const BG_IMAGE = "https://houseofdebt.org/wp-content/uploads/Depositphotos_381506284_S.jpg";
    
    const [requests, setRequests] = useState([]);
    const customerId = localStorage.getItem('userId');

    /**
     * Effect Hook: Fetches the specific booking requests for the 
     * logged-in customer when the component mounts.
     */
    useEffect(() => {
        const fetchMyRequests = async () => {
            try {
                // API call to retrieve historical booking data
                const res = await CustomerService.getMyRequests(customerId);
                setRequests(res.data || []);
            } catch (err) { 
                console.error("Critical: Failed to sync reservation data.", err); 
            }
        };
        if (customerId) fetchMyRequests();
    }, [customerId]);

    // Reusable Header Style for the Data Table
    const tableHeaderStyle = { 
        bgcolor: 'rgba(17, 17, 17, 0.9)', 
        '& .MuiTableCell-root': { 
            color: PRIMARY_ORANGE, 
            fontWeight: '900', 
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            textAlign: 'center',
            letterSpacing: 2
        } 
    };

    return (
        <Box sx={{ 
            bgcolor: DARK_BG, 
            minHeight: '100vh', 
            pb: 10, 
            color: '#fff',
            // Applying the background image with a dark linear gradient overlay
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0.9)), url(${BG_IMAGE})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
        }}>
            
            {/* --- 1. HERO HEADER SECTION --- */}
            <Box sx={{ py: 10, textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" mb={1}>
                        <HistoryIcon sx={{ color: PRIMARY_ORANGE, fontSize: 24 }} />
                        <Typography variant="overline" sx={{ color: PRIMARY_ORANGE, letterSpacing: 8, fontWeight: 900 }}>
                            TRANSACTION LEDGER
                        </Typography>
                    </Stack>
                    <Typography variant="h2" fontWeight="900" sx={{ textShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                        MY <span style={{ color: PRIMARY_ORANGE }}>RESERVATIONS</span>
                    </Typography>
                </motion.div>
            </Box>

            <Container maxWidth="lg" sx={{ mt: 6 }}>
                {/* --- 2. GLASS-MORPHISM DATA TABLE --- */}
                <TableContainer component={Paper} sx={{ 
                    bgcolor: 'rgba(10, 10, 10, 0.85)', 
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.05)', 
                    borderRadius: 0,
                    boxShadow: '0 25px 50px rgba(0,0,0,0.7)'
                }}>
                    <Table>
                        <TableHead sx={tableHeaderStyle}>
                            <TableRow>
                                <TableCell>VEHICLE CATEGORY</TableCell>
                                <TableCell>QUOTED PRICE</TableCell>
                                <TableCell>DATE OF REQUEST</TableCell>
                                <TableCell>STATUS</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {requests.length > 0 ? requests.map((req) => (
                                <TableRow key={req.requestId} hover sx={{ '&:hover': { bgcolor: 'rgba(255, 87, 34, 0.05) !important' } }}>
                                    {/* Column: Vehicle info with specific branding icon */}
                                    <TableCell sx={{ color: '#fff', textAlign: 'center' }}>
                                        <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
                                            <ReceiptLongIcon sx={{ fontSize: 18, color: PRIMARY_ORANGE, opacity: 0.7 }} />
                                            <Typography variant="body1" fontWeight="500">{req.vehicleType}</Typography>
                                        </Stack>
                                    </TableCell>
                                    
                                    {/* Column: Final Calculated Price */}
                                    <TableCell sx={{ color: PRIMARY_ORANGE, textAlign: 'center', fontWeight: '900', fontSize: '1.1rem' }}>
                                        LKR {req.finalPrice.toLocaleString()}
                                    </TableCell>
                                    
                                    {/* Column: Formatted Date String */}
                                    <TableCell sx={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center' }}>
                                        {new Date(req.requestDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </TableCell>
                                    
                                    {/* Column: Dynamic status chip based on approval state */}
                                    <TableCell sx={{ textAlign: 'center' }}>
                                        <Chip 
                                            label={req.status} 
                                            variant="outlined"
                                            sx={{ 
                                                color: req.status === 'PENDING' ? '#ffb300' : '#4caf50', 
                                                borderColor: req.status === 'PENDING' ? '#ffb300' : '#4caf50',
                                                borderRadius: 0,
                                                fontWeight: '900',
                                                fontSize: '0.7rem'
                                            }} 
                                        />
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    {/* Empty State: Shown when no records exist in the DB */}
                                    <TableCell colSpan={4} align="center" sx={{ py: 15, color: 'rgba(255,255,255,0.3)' }}>
                                        <Typography variant="h6">No reservation history detected.</Typography>
                                        <Typography variant="caption">Book your first vehicle from our premium fleet to see records here.</Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
        </Box>
    );
};

export default MyBookings;