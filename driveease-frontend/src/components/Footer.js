import React from 'react';
import { Box, Container, Grid, Typography, Link, Stack, Divider } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import logoImg from '../assets/logo.png'; // Logo image path eka

const Footer = () => {
    const PRIMARY_ORANGE = "#ff5722";
    const DARK_BG = "#1a1a1a";

    return (
        <Box sx={{ bgcolor: DARK_BG, color: 'white', pt: 8, pb: 4, mt: 'auto' }}>
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    {/* --- LOGO & ABOUT --- */}
                    <Grid item xs={12} md={4}>
                        <Stack direction="row" alignItems="center" sx={{ mb: 2 }}>
                            <Box component="img" src={logoImg} sx={{ height: 40, mr: 1.5, borderRadius: '50%', bgcolor: 'white', p: '2px' }} />
                            <Typography variant="h6" fontWeight="900">DRIVE<span style={{ color: PRIMARY_ORANGE }}>EASE</span></Typography>
                        </Stack>
                        <Typography variant="body2" sx={{ opacity: 0.7, lineHeight: 1.8 }}>
                            Premium vehicle rentals for your journey. Experience comfort and style with our extensive fleet managed by professional agents.
                        </Typography>
                    </Grid>

                    {/* --- QUICK LINKS --- */}
                    <Grid item xs={6} md={2}>
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, color: PRIMARY_ORANGE }}>Quick Links</Typography>
                        <Stack spacing={1}>
                            <Link href="/" color="inherit" underline="none" sx={{ '&:hover': { color: PRIMARY_ORANGE } }}>Home</Link>
                            <Link href="/about" color="inherit" underline="none" sx={{ '&:hover': { color: PRIMARY_ORANGE } }}>About Us</Link>
                            <Link href="/contact" color="inherit" underline="none" sx={{ '&:hover': { color: PRIMARY_ORANGE } }}>Contact</Link>
                        </Stack>
                    </Grid>

                    {/* --- SUPPORT --- */}
                    <Grid item xs={6} md={3}>
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, color: PRIMARY_ORANGE }}>Support</Typography>
                        <Stack spacing={1}>
                            <Typography variant="body2" sx={{ opacity: 0.7 }}>24/7 Roadside Assistance</Typography>
                            <Typography variant="body2" sx={{ opacity: 0.7 }}>Terms & Conditions</Typography>
                            <Typography variant="body2" sx={{ opacity: 0.7 }}>Privacy Policy</Typography>
                        </Stack>
                    </Grid>

                    {/* --- SOCIALS --- */}
                    <Grid item xs={12} md={3}>
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, color: PRIMARY_ORANGE }}>Follow Us</Typography>
                        <Stack direction="row" spacing={2}>
                            <FacebookIcon sx={{ cursor: 'pointer', '&:hover': { color: PRIMARY_ORANGE } }} />
                            <TwitterIcon sx={{ cursor: 'pointer', '&:hover': { color: PRIMARY_ORANGE } }} />
                            <InstagramIcon sx={{ cursor: 'pointer', '&:hover': { color: PRIMARY_ORANGE } }} />
                        </Stack>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 4, bgcolor: 'rgba(255,255,255,0.1)' }} />
                
                <Typography variant="body2" align="center" sx={{ opacity: 0.5 }}>
                    © {new Date().getFullYear()} DriveEase Rental System. All rights reserved. Developed with ❤️ in Sri Lanka.
                </Typography>
            </Container>
        </Box>
    );
};

export default Footer;