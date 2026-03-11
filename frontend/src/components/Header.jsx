import React from 'react';
import { AppBar, Toolbar, Typography, Button, Stack, Container, Divider, Box } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'; 
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { authService } from '../api/authService';
// 🔥 Logo import eka
import logo from '../assets/logo.png';

const Header = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    const loggedIn = authService.isAuthenticated();
    const userRole = authService.getUserRole();

    const handleLogout = () => {
        authService.logoutUser();
        navigate('/login');
    };

    return (
        <AppBar position="fixed" sx={{ 
            bgcolor: 'rgba(255, 255, 255, 0.85)', 
            backdropFilter: 'blur(15px)', 
            boxShadow: '0 2px 15px rgba(0,0,0,0.05)',
            borderBottom: `1px solid ${theme.palette.divider}`,
            zIndex: 1300 
        }}>
            <Container maxWidth="xl">
                <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
                    
                    {/* Brand Logo with Image */}
                    <Stack 
                        direction="row" 
                        alignItems="center" 
                        spacing={1.5} 
                        sx={{ cursor: 'pointer' }}
                        onClick={() => navigate('/')} 
                    >
                        {/* 🔥 Displaying the Logo Image */}
                        <Box 
                            component="img" 
                            src={logo} 
                            alt="DriveEase Logo" 
                            sx={{ height: 45, width: 'auto', objectFit: 'contain' }} 
                        />
                        <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: '-1.5px', color: theme.palette.text.primary }}>
                            DriveEase.
                        </Typography>
                    </Stack>

                    {/* Navigation Menu */}
                    <Stack direction="row" spacing={4} sx={{ display: { xs: 'none', md: 'flex' } }}>
                        {[
                            { label: 'HOME', path: '/' },
                            { label: 'FLEET', path: '/fleet-portal' },
                            { label: 'ABOUT US', path: '/about' },
                        ].map((item) => (
                            <Typography 
                                key={item.label} 
                                onClick={() => navigate(item.path)}
                                sx={{ 
                                    fontSize: '0.75rem', 
                                    fontWeight: 800, 
                                    color: theme.palette.text.secondary,
                                    cursor: 'pointer', 
                                    '&:hover': { color: theme.palette.primary.main }, 
                                    transition: '0.3s' 
                                }}
                            >
                                {item.label}
                            </Typography>
                        ))}
                        
                        <Typography 
                            onClick={() => navigate('/contact')}
                            sx={{ 
                                fontSize: '0.75rem', 
                                fontWeight: 800, 
                                color: theme.palette.text.secondary,
                                cursor: 'pointer', 
                                '&:hover': { color: theme.palette.primary.main }, 
                                transition: '0.3s' 
                            }}
                        >
                            CONTACT US
                        </Typography>
                    </Stack>

                    {/* Action Buttons */}
                    <Stack direction="row" spacing={2} alignItems="center">
                        {loggedIn && userRole === 'ADMIN' && (
                            <Button 
                                onClick={() => navigate('/admin')}
                                startIcon={<AdminPanelSettingsIcon />}
                                sx={{ 
                                    color: theme.palette.secondary.main, 
                                    fontWeight: 1000, 
                                    fontSize: '0.75rem',
                                    border: `2px solid ${theme.palette.secondary.main}`,
                                    borderRadius: '12px',
                                    px: 2,
                                    '&:hover': { bgcolor: `${theme.palette.secondary.main}10` }
                                }}
                            >
                                ADMIN INTEL
                            </Button>
                        )}

                        {loggedIn && userRole === 'AGENT' && (
                            <Button 
                                onClick={() => navigate('/agent-dashboard')}
                                sx={{ color: theme.palette.primary.main, fontWeight: 800, fontSize: '0.75rem' }}
                            >
                                AGENT PANEL
                            </Button>
                        )}

                        {loggedIn && userRole === 'CUSTOMER' && (
                            <>
                                <Button 
                                    onClick={() => navigate('/customer-dashboard')}
                                    startIcon={<HistoryIcon />}
                                    sx={{ 
                                        color: theme.palette.text.primary, 
                                        fontWeight: 800, 
                                        fontSize: '0.7rem',
                                        '&:hover': { bgcolor: '#f1f5f9' }
                                    }}
                                >
                                    MY ACTIVITY
                                </Button>

                                <Button 
                                    onClick={() => navigate('/customer-profile')}
                                    startIcon={<PersonIcon />}
                                    sx={{ 
                                        color: theme.palette.text.primary, 
                                        fontWeight: 800, 
                                        fontSize: '0.7rem',
                                        '&:hover': { bgcolor: '#f1f5f9' }
                                    }}
                                >
                                    PROFILE
                                </Button>
                            </>
                        )}

                        <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 20, alignSelf: 'center' }} />

                        {!loggedIn ? (
                            <>
                                <Button 
                                    onClick={() => navigate('/login')}
                                    sx={{ color: theme.palette.text.primary, fontWeight: 700 }}
                                >
                                    SIGN IN
                                </Button>

                                <Button 
                                    component={motion.button} 
                                    whileHover={{ scale: 1.05 }} 
                                    whileTap={{ scale: 0.95 }}
                                    variant="contained" 
                                    onClick={() => navigate('/register')}
                                    sx={{ 
                                        bgcolor: theme.palette.secondary.main, 
                                        borderRadius: '25px', 
                                        px: 4, 
                                        fontWeight: 800,
                                        '&:hover': { bgcolor: theme.palette.secondary.dark }
                                    }}
                                >
                                    REGISTER
                                </Button>
                            </>
                        ) : (
                            <Button 
                                onClick={handleLogout}
                                variant="outlined"
                                sx={{ 
                                    borderColor: '#e2e8f0',
                                    color: '#64748b',
                                    borderRadius: '25px', 
                                    px: 3, 
                                    fontWeight: 700,
                                    '&:hover': { bgcolor: '#f1f5f9', borderColor: '#cbd5e1' }
                                }}
                            >
                                LOGOUT
                            </Button>
                        )}
                    </Stack>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Header;