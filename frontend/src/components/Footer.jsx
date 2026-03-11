import React from 'react';
import { Box, Container, Grid, Typography, Stack, IconButton, Divider, TextField, Button } from '@mui/material'; 
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
// 🔥 Logo import eka
import logo from '../assets/logo.png';

const Footer = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    return (
        <Box sx={{ 
            position: 'relative',
            pt: 12, 
            pb: 6, 
            overflow: 'hidden',
            bgcolor: '#0f172a',
            zIndex: 1200, 
            mt: 'auto'
        }}>
            {/* --- LIQUID GLASS LAYER --- */}
            <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1,
                background: `
                    radial-gradient(circle at 20% 30%, rgba(0, 82, 204, 0.15) 0%, transparent 50%),
                    radial-gradient(circle at 80% 70%, rgba(245, 0, 87, 0.1) 0%, transparent 50%),
                    rgba(23, 43, 77, 0.8)
                `,
                backdropFilter: 'blur(30px) saturate(150%)',
                borderTop: '1px solid rgba(255, 255, 255, 0.2)',
            }} />

            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
                {/* --- TOP SECTION: CENTERED NEWSLETTER --- */}
                <Box sx={{ textAlign: 'center', mb: 10 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <Typography variant="h6" sx={{ fontWeight: 900, mb: 2, color: '#fff', textTransform: 'uppercase', letterSpacing: 3 }}>
                            Join the Elite Circle
                        </Typography>
                        <Typography sx={{ color: 'rgba(255,255,255,0.6)', mb: 4, maxWidth: '600px', mx: 'auto' }}>
                            Subscribe to receive exclusive offers and the latest updates on our premium fleet directly in your inbox.
                        </Typography>
                        
                        <Box sx={{ 
                            maxWidth: '500px',
                            mx: 'auto',
                            p: '4px', 
                            borderRadius: '50px', 
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            display: 'flex',
                            backdropFilter: 'blur(10px)',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                        }}>
                            <TextField 
                                fullWidth
                                variant="standard" 
                                placeholder="Enter your email address" 
                                InputProps={{ disableUnderline: true, sx: { color: '#fff', px: 3, fontSize: '0.95rem' } }}
                            />
                            <Button 
                                variant="contained" 
                                sx={{ 
                                    bgcolor: theme.palette.secondary.main, 
                                    borderRadius: '50px',
                                    fontWeight: 900,
                                    px: 5,
                                    boxShadow: '0 4px 15px rgba(245, 0, 87, 0.4)',
                                    '&:hover': { bgcolor: theme.palette.secondary.dark, transform: 'scale(1.02)' },
                                    transition: '0.3s'
                                }}
                            >JOIN</Button>
                        </Box>
                    </motion.div>
                </Box>

                <Divider sx={{ mb: 10, bgcolor: 'rgba(255,255,255,0.1)' }} />

                <Grid container spacing={8}>
                    {/* Brand Section with Logo Image */}
                    <Grid item xs={12} md={4}>
                        <Stack spacing={4}>
                            <Stack direction="row" alignItems="center" spacing={1.5}>
                                {/* 🔥 Logo added to Footer */}
                                <Box 
                                    component="img" 
                                    src={logo} 
                                    alt="DriveEase Logo" 
                                    sx={{ 
                                        height: 40, 
                                        width: 'auto', 
                                        objectFit: 'contain',
                                        filter: 'brightness(1.2)' // Dark footer eke pēna widiyata brightness poddak wedi kala
                                    }} 
                                />
                                <Typography variant="h4" sx={{ fontWeight: 950, letterSpacing: '-2px', color: '#fff' }}>
                                    DriveEase.
                                </Typography>
                            </Stack>
                            <Typography sx={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.9 }}>
                                Sri Lanka's premium vehicle management ecosystem. Engineering luxury mobility for the modern world.
                            </Typography>
                        </Stack>
                    </Grid>

                    {/* Navigation */}
                    <Grid item xs={6} md={2}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 4, color: '#fff', textTransform: 'uppercase', letterSpacing: 2 }}>Company</Typography>
                        <Stack spacing={2}>
                            {['About Us', 'Our Fleet', 'Services', 'Contact'].map(item => (
                                <Typography 
                                    key={item} 
                                    onClick={() => navigate(item === 'About Us' ? '/about' : item === 'Contact' ? '/contact' : '/')}
                                    sx={{ cursor: 'pointer', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', '&:hover': { color: theme.palette.secondary.main } }}
                                >
                                    {item}
                                </Typography>
                            ))}
                        </Stack>
                    </Grid>

                    {/* Support */}
                    <Grid item xs={6} md={2}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 4, color: '#fff', textTransform: 'uppercase', letterSpacing: 2 }}>Support</Typography>
                        <Stack spacing={2}>
                            {['Help Center', 'Safety Info', 'Privacy Policy', 'Terms'].map(item => (
                                <Typography key={item} sx={{ cursor: 'pointer', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', '&:hover': { color: theme.palette.secondary.main } }}>{item}</Typography>
                            ))}
                        </Stack>
                    </Grid>

                    {/* Socials */}
                    <Grid item xs={12} md={4}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 4, color: '#fff', textTransform: 'uppercase', letterSpacing: 2 }}>Follow Us</Typography>
                        <Stack direction="row" spacing={2}>
                            {[FacebookIcon, InstagramIcon, TwitterIcon, LinkedInIcon].map((Icon, i) => (
                                <IconButton key={i} sx={{ color: '#fff', border: '1px solid rgba(255,255,255,0.1)', '&:hover': { color: theme.palette.secondary.main, borderColor: theme.palette.secondary.main } }}>
                                    <Icon fontSize="small" />
                                </IconButton>
                            ))}
                        </Stack>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 8, bgcolor: 'rgba(255,255,255,0.05)' }} />

                <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" spacing={3}>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>
                        © 2026 DriveEase Elite. Handcrafted for premium mobility.
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.secondary.main, fontWeight: 900, letterSpacing: 4, fontSize: '0.7rem' }}>
                        DRIVE THE FUTURE
                    </Typography>
                </Stack>
            </Container>
        </Box>
    );
};

export default Footer;