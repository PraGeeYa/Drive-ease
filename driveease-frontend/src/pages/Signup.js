import React, { useState } from 'react';
import { 
    Box, Grid, Typography, TextField, Button, InputAdornment, 
    IconButton, Stack, Alert, MenuItem, Paper, Divider, Snackbar
} from '@mui/material';
import { Visibility, VisibilityOff, Facebook, Twitter, Instagram } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthService from '../api/Services/AuthService'; 

const backgroundImageUrl = "https://img.freepik.com/premium-photo/car-rental-website-computer-screen-tourist-rent-car-snugly_31965-484348.jpg?semt=ais_user_personalization&w=740&q=80";

const Signup = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ 
        username: '', 
        email: '', 
        password: '', 
        role: 'CUSTOMER' 
    });
    
    // --- POP-UP STATES ---
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const PRIMARY_ORANGE = "#ff5722"; 

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbar({ ...snackbar, open: false });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.username || !formData.email || !formData.password) {
            setError('All fields are mandatory for secure access.');
            return;
        }

        try {
            setLoading(true);
            setError('');
            const res = await AuthService.signup(formData);
            if (res.status === 200) {
                // Success Pop-up eka trigger karanawa
                setSnackbar({ open: true, message: "REGISTRATION SUCCESSFUL! REDIRECTING...", severity: 'success' });
                
                // Seconds 2kin login ekata auto navigate karanawa
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
        } catch (err) {
            console.error("Signup error", err);
            setError(err.response?.data || "Registration failed. Database error.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ 
            minHeight: '100vh', 
            backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 100%), url(${backgroundImageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            color: '#ffffff',
            fontFamily: "'Inter', sans-serif"
        }}>
            <Grid container sx={{ minHeight: '100vh' }}>
                
                {/* LEFT SIDE: BRANDING */}
                <Grid item xs={12} md={7} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', p: { xs: 4, md: 12 } }}>
                    <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                        <Typography variant="overline" sx={{ color: PRIMARY_ORANGE, letterSpacing: 8, fontWeight: 900 }}>
                            DRIVEEASE NETWORK
                        </Typography>
                        <Typography variant="h1" fontWeight="900" sx={{ fontSize: { xs: '3.5rem', md: '5.5rem' }, mb: 2, color: '#ffffff', lineHeight: 1 }}>
                            SIGN <span style={{ color: PRIMARY_ORANGE }}>UP.</span>
                        </Typography>
                        <Typography variant="h6" sx={{ opacity: 0.8, maxWidth: '500px', mb: 4, color: '#ffffff', lineHeight: 1.6 }}>
                            Unlock premium fleet management and exclusive booking access. 
                            Join the elite DriveEase network today.
                        </Typography>
                        
                        <Stack direction="row" spacing={3}>
                            <IconButton sx={{ color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}><Facebook /></IconButton>
                            <IconButton sx={{ color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}><Twitter /></IconButton>
                            <IconButton sx={{ color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}><Instagram /></IconButton>
                        </Stack>
                    </motion.div>
                </Grid>

                {/* RIGHT SIDE: GLASS FORM (Text Visibility Fix) */}
                <Grid item xs={12} md={5} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2, bgcolor: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(10px)' }}>
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                        <Paper elevation={0} sx={{ 
                            p: { xs: 4, md: 6 }, 
                            bgcolor: 'rgba(15, 15, 15, 0.95)', 
                            backdropFilter: 'blur(20px)',
                            borderRadius: 0, 
                            border: '1px solid rgba(255,255,255,0.1)',
                            width: '100%',
                            maxWidth: '430px'
                        }}>
                            <Stack spacing={3}>
                                <Box>
                                    <Typography variant="h4" fontWeight="900" sx={{ mb: 1, color: '#ffffff', letterSpacing: -1 }}>CREATE ACCOUNT</Typography>
                                    <Box sx={{ width: 40, height: 4, bgcolor: PRIMARY_ORANGE, mb: 1 }} />
                                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>Enter your details to synchronize with the network.</Typography>
                                </Box>

                                {error && <Alert severity="error" sx={{ bgcolor: 'rgba(211, 47, 47, 0.1)', color: '#ff5252', borderRadius: 0, borderLeft: `4px solid #ff5252` }}>{error}</Alert>}

                                <Box component="form" noValidate>
                                    <TextField 
                                        label="USERNAME" 
                                        fullWidth
                                        variant="standard"
                                        InputLabelProps={{ style: { color: PRIMARY_ORANGE, fontWeight: 700, fontSize: '0.75rem', letterSpacing: 2 } }}
                                        sx={{ input: { color: '#ffffff', fontSize: '1.1rem' }, '& .MuiInput-underline:before': { borderBottomColor: 'rgba(255,255,255,0.2)' }, mb: 3 }}
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    />

                                    <TextField 
                                        label="EMAIL ADDRESS" 
                                        type="email"
                                        fullWidth
                                        variant="standard"
                                        InputLabelProps={{ style: { color: PRIMARY_ORANGE, fontWeight: 700, fontSize: '0.75rem', letterSpacing: 2 } }}
                                        sx={{ input: { color: '#ffffff', fontSize: '1.1rem' }, '& .MuiInput-underline:before': { borderBottomColor: 'rgba(255,255,255,0.2)' }, mb: 3 }}
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />

                                    <TextField 
                                        label="PASSWORD" 
                                        type={showPassword ? 'text' : 'password'}
                                        fullWidth
                                        variant="standard"
                                        InputLabelProps={{ style: { color: PRIMARY_ORANGE, fontWeight: 700, fontSize: '0.75rem', letterSpacing: 2 } }}
                                        sx={{ input: { color: '#ffffff', fontSize: '1.1rem' }, '& .MuiInput-underline:before': { borderBottomColor: 'rgba(255,255,255,0.2)' }, mb: 3 }}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={() => setShowPassword(!showPassword)} sx={{ color: 'rgba(255,255,255,0.3)' }}>
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />

                                    <TextField 
                                        select
                                        label="ACCOUNT ROLE"
                                        fullWidth
                                        variant="standard"
                                        InputLabelProps={{ style: { color: PRIMARY_ORANGE, fontWeight: 700, fontSize: '0.75rem', letterSpacing: 2 } }}
                                        sx={{ 
                                            '& .MuiInput-underline:before': { borderBottomColor: 'rgba(255,255,255,0.2)' },
                                            '& .MuiSelect-icon': { color: '#fff' },
                                            '& .MuiInputBase-input': { color: '#ffffff' },
                                            mb: 4
                                        }}
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    >
                                        <MenuItem value="CUSTOMER">Customer</MenuItem>
                                        <MenuItem value="AGENT">Support Agent</MenuItem>
                                    </TextField>

                                    <Button 
                                        onClick={handleSubmit}
                                        variant="contained" 
                                        fullWidth
                                        disabled={loading}
                                        sx={{ 
                                            bgcolor: PRIMARY_ORANGE, 
                                            color: '#ffffff', 
                                            fontWeight: '900', 
                                            py: 2, 
                                            borderRadius: 0, 
                                            boxShadow: `0 10px 20px ${PRIMARY_ORANGE}44`,
                                            '&:hover': { bgcolor: '#ffffff', color: '#000000' } 
                                        }}
                                    >
                                        {loading ? 'INITIALIZING...' : 'AUTHORIZE ACCOUNT'}
                                    </Button>
                                </Box>

                                <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                        Registered already? <Link to="/login" style={{ color: PRIMARY_ORANGE, fontWeight: 'bold', textDecoration: 'none' }}>Log In</Link>
                                    </Typography>
                                </Box>
                            </Stack>
                        </Paper>
                    </motion.div>
                </Grid>
            </Grid>

            {/* --- 🔔 SUCCESS NOTIFICATION POP-UP --- */}
            <Snackbar 
                open={snackbar.open} 
                autoHideDuration={3000} 
                onClose={handleCloseSnackbar} 
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert 
                    onClose={handleCloseSnackbar} 
                    severity={snackbar.severity} 
                    sx={{ width: '100%', borderRadius: 0, bgcolor: '#1b3320', color: '#4caf50', border: '1px solid #4caf50', fontWeight: 'bold' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Signup;