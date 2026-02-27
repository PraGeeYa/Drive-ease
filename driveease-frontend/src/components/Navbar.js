import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container, Stack } from '@mui/material';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
// LoginIcon use karanne nathi nisa ain kala
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'; 

// Logo image path
import logoImg from '../assets/logo.png'; 

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const role = localStorage.getItem('role');
    const isAuthenticated = localStorage.getItem('userId');

    const PRIMARY_ORANGE = "#ff5722";
    const DARK_BG = "#000000"; // Black background for consistency with Home

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    const navButtonStyle = (path) => ({
        color: 'white',
        mx: 1,
        fontSize: '0.85rem',
        fontWeight: '700', 
        letterSpacing: '1px',
        position: 'relative',
        textTransform: 'uppercase', 
        '&::after': {
            content: '""',
            position: 'absolute',
            width: isActive(path) ? '100%' : '0%',
            height: '2px',
            bottom: 5,
            left: 0,
            bgcolor: PRIMARY_ORANGE,
            transition: '0.3s'
        },
        '&:hover::after': {
            width: '100%'
        },
        '&:hover': {
            color: PRIMARY_ORANGE,
            bgcolor: 'transparent'
        }
    });

    return (
        <AppBar position="sticky" sx={{ bgcolor: DARK_BG, borderBottom: '1px solid rgba(255,255,255,0.1)', boxShadow: 'none' }}>
            <Container maxWidth="xl">
                <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
                    
                    {/* --- LOGO SECTION --- */}
                    <Stack 
                        direction="row" 
                        alignItems="center" 
                        component={Link} 
                        to="/" 
                        sx={{ textDecoration: 'none', color: 'white' }}
                    >
                        <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', mr: 1.5 }}>
                            <Box
                                component="img"
                                src={logoImg}
                                alt="DriveEase Logo"
                                sx={{
                                    height: 45,
                                    width: 45,
                                    borderRadius: '50%',
                                    border: `2px solid ${PRIMARY_ORANGE}`,
                                    padding: '2px',
                                    bgcolor: 'white',
                                    transition: '0.4s',
                                    '&:hover': { transform: 'rotate(360deg)' } 
                                }}
                            />
                        </Box>

                        <Typography variant="h5" sx={{ fontWeight: '900', letterSpacing: '-1px', display: { xs: 'none', sm: 'block' } }}>
                            DRIVE<span style={{ color: PRIMARY_ORANGE }}>EASE</span>
                        </Typography>
                    </Stack>

                    {/* --- MAIN NAVIGATION --- */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Button sx={navButtonStyle('/')} component={Link} to="/">Home</Button>
                        <Button sx={navButtonStyle('/fleet')} component={Link} to="/fleet" startIcon={<DirectionsCarIcon />}>Fleet</Button>
                        <Button sx={navButtonStyle('/about')} component={Link} to="/about">About</Button>
                        <Button sx={navButtonStyle('/contact')} component={Link} to="/contact">Contact</Button>

                        {/* Role-Based Links */}
                        {isAuthenticated && role === 'CUSTOMER' && (
                            <Button sx={navButtonStyle('/my-bookings')} component={Link} to="/my-bookings">My Bookings</Button>
                        )}

                        {isAuthenticated && role === 'AGENT' && (
                            <>
                                <Button sx={navButtonStyle('/agent-dashboard')} component={Link} to="/agent-dashboard">Bookings</Button>
                                <Button sx={navButtonStyle('/agent-inventory')} component={Link} to="/agent-inventory">Records</Button>
                                <Button sx={navButtonStyle('/agent-requests')} component={Link} to="/agent-requests">Requests</Button>
                            </>
                        )}

                        {isAuthenticated && role === 'ADMIN' && (
                            <Button sx={navButtonStyle('/admin')} component={Link} to="/admin">Dashboard</Button>
                        )}

                        {/* --- AUTH BUTTONS --- */}
                        <Box sx={{ ml: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                            {isAuthenticated ? (
                                <Button 
                                    onClick={handleLogout}
                                    variant="outlined"
                                    startIcon={<LogoutIcon />}
                                    sx={{ 
                                        color: 'white', 
                                        borderColor: PRIMARY_ORANGE, 
                                        borderRadius: 0,
                                        fontWeight: 'bold',
                                        '&:hover': { bgcolor: PRIMARY_ORANGE, borderColor: PRIMARY_ORANGE, color: 'white' }
                                    }}
                                >
                                    Logout
                                </Button>
                            ) : (
                                <>
                                    <Button 
                                        component={Link} to="/login"
                                        sx={{ color: 'white', fontWeight: 'bold', '&:hover': { color: PRIMARY_ORANGE } }}
                                    >
                                        Login
                                    </Button>
                                    <Button 
                                        component={Link} to="/signup"
                                        variant="contained"
                                        sx={{ 
                                            bgcolor: PRIMARY_ORANGE, 
                                            color: 'white', 
                                            fontWeight: 'bold',
                                            borderRadius: 0,
                                            px: 3,
                                            '&:hover': { bgcolor: 'white', color: DARK_BG }
                                        }}
                                    >
                                        Join Now
                                    </Button>
                                </>
                            )}
                        </Box>
                    </Box>

                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navbar;