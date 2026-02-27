import React, { useState } from 'react';
import { 
    Box, Grid, Typography, TextField, Button, InputAdornment, 
    IconButton, Stack, Alert, Paper, Divider
} from '@mui/material';
import { Visibility, VisibilityOff, Facebook, Twitter, Instagram } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthService from '../api/Services/AuthService'; 

const backgroundImageUrl = "https://thumbs.dreamstime.com/b/car-rental-website-computer-screen-tourist-to-rent-brisk-transportation-426150251.jpg";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const PRIMARY_ORANGE = "#ff5722"; 

    /**
     * handleLogin processes the authentication request.
     * Regardless of the user role (Admin, Agent, or Customer), 
     * the user will be redirected to the Home Page (/) upon success.
     */
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError('');
            
            // Sending login request to backend
            const response = await AuthService.login({ username, password });
            const { role, userId } = response.data;

            // Persisting user identity in local storage for session management
            localStorage.setItem('role', role); 
            localStorage.setItem('userId', userId);

            /**
             * REDIRECTION LOGIC:
             * Every user is forced to the Home Page first.
             * They can access their specific dashboards via the Navbar.
             */
            navigate('/'); 

        } catch (err) {
            setError('Authentication failed. Please check credentials.');
            console.error("Login Error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ 
            minHeight: '100vh', 
            backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 100%), url(${backgroundImageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            color: '#fff',
            fontFamily: "'Inter', sans-serif"
        }}>
            <Grid container sx={{ minHeight: '100vh' }}>
                
                {/* LEFT SIDE: BRANDING */}
                <Grid item xs={12} md={7} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', p: { xs: 4, md: 12 } }}>
                    <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                        <Typography variant="overline" sx={{ color: PRIMARY_ORANGE, letterSpacing: 8, fontWeight: 900 }}>
                            DRIVEEASE NETWORK
                        </Typography>
                        <Typography variant="h1" fontWeight="900" sx={{ fontSize: { xs: '3.5rem', md: '5.5rem' }, mb: 2, lineHeight: 1 }}>
                            LOG <span style={{ color: PRIMARY_ORANGE }}>IN.</span>
                        </Typography>
                        <Typography variant="h6" sx={{ opacity: 0.6, maxWidth: '500px', mb: 4, fontWeight: 400, lineHeight: 1.6 }}>
                            Securely access Sri Lanka's most advanced car rental fleet management system. 
                            Your journey begins with a single click.
                        </Typography>
                        
                        <Stack direction="row" spacing={3}>
                            <IconButton sx={{ color: '#fff', border: '1px solid rgba(255,255,255,0.1)', '&:hover': { color: PRIMARY_ORANGE, borderColor: PRIMARY_ORANGE } }}><Facebook /></IconButton>
                            <IconButton sx={{ color: '#fff', border: '1px solid rgba(255,255,255,0.1)', '&:hover': { color: PRIMARY_ORANGE, borderColor: PRIMARY_ORANGE } }}><Twitter /></IconButton>
                            <IconButton sx={{ color: '#fff', border: '1px solid rgba(255,255,255,0.1)', '&:hover': { color: PRIMARY_ORANGE, borderColor: PRIMARY_ORANGE } }}><Instagram /></IconButton>
                        </Stack>
                    </motion.div>
                </Grid>

                {/* RIGHT SIDE: GLASS-MORPHISM LOGIN FORM (CENTERED VERTICALLY) */}
                <Grid item xs={12} md={5} sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    p: 2,
                    bgcolor: 'rgba(0,0,0,0.2)', 
                    backdropFilter: 'blur(10px)'
                }}>
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
                            <Stack spacing={4}>
                                <Box>
                                    <Typography variant="h4" fontWeight="900" sx={{ mb: 1, letterSpacing: -1, color: '#ffffff' }}>Sign In</Typography>
                                    <Box sx={{ width: 40, height: 4, bgcolor: PRIMARY_ORANGE, mb: 2 }} />
                                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>Enter your authorization credentials below.</Typography>
                                </Box>

                                {error && <Alert severity="error" sx={{ bgcolor: 'rgba(211, 47, 47, 0.1)', color: '#ff5252', borderRadius: 0, borderLeft: `4px solid #ff5252` }}>{error}</Alert>}

                                <Box component="form" onSubmit={handleLogin}>
                                    <TextField 
                                        label="USERNAME" 
                                        fullWidth
                                        variant="standard"
                                        required
                                        InputLabelProps={{ style: { color: PRIMARY_ORANGE, fontWeight: 700, fontSize: '0.75rem', letterSpacing: 2 } }}
                                        sx={{ 
                                            input: { color: '#ffffff', fontSize: '1.1rem' }, 
                                            '& .MuiInput-underline:before': { borderBottomColor: 'rgba(255,255,255,0.2)' }, 
                                            '& .MuiInput-underline:after': { borderBottomColor: PRIMARY_ORANGE }, 
                                            mb: 4 
                                        }}
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />

                                    <TextField 
                                        label="PASSWORD" 
                                        type={showPassword ? 'text' : 'password'}
                                        fullWidth
                                        variant="standard"
                                        required
                                        InputLabelProps={{ style: { color: PRIMARY_ORANGE, fontWeight: 700, fontSize: '0.75rem', letterSpacing: 2 } }}
                                        sx={{ 
                                            input: { color: '#ffffff', fontSize: '1.1rem' }, 
                                            '& .MuiInput-underline:before': { borderBottomColor: 'rgba(255,255,255,0.2)' }, 
                                            '& .MuiInput-underline:after': { borderBottomColor: PRIMARY_ORANGE }, 
                                            mb: 6 
                                        }}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={() => setShowPassword(!showPassword)} sx={{ color: 'rgba(255,255,255,0.3)' }}>
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />

                                    <Button 
                                        type="submit"
                                        variant="contained" 
                                        fullWidth
                                        disabled={loading}
                                        sx={{ 
                                            bgcolor: PRIMARY_ORANGE, 
                                            color: '#fff', 
                                            fontWeight: '900', 
                                            py: 2, 
                                            borderRadius: 0, 
                                            letterSpacing: 2,
                                            boxShadow: `0 10px 20px ${PRIMARY_ORANGE}44`,
                                            '&:hover': { bgcolor: '#fff', color: '#000' } 
                                        }}
                                    >
                                        {loading ? 'AUTHENTICATING...' : 'ACCESS DASHBOARD'}
                                    </Button>
                                </Box>

                                <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                                        New to the network? <Link to="/signup" style={{ color: PRIMARY_ORANGE, fontWeight: 'bold', textDecoration: 'none' }}>Create Account</Link>
                                    </Typography>
                                </Box>
                            </Stack>
                        </Paper>
                    </motion.div>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Login;