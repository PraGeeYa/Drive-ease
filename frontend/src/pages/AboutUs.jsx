import React from 'react';
import { Box, Container, Typography, Grid, Paper, Stack, Avatar, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';

// Icons
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';

const AboutUs = () => {
    const theme = useTheme();

    return (
        // 🔥 Root Box eka width 100% kala saha m-0 damma his ida nethi wenna
        <Box sx={{ width: '100%', bgcolor: '#fff', minHeight: '100vh', overflowX: 'hidden', m: 0, p: 0 }}>
            
            {/* 1. HERO SECTION - Full Width Edge to Edge */}
            <Box sx={{ 
                width: '100%',
                position: 'relative', 
                height: { xs: '450px', md: '550px' }, 
                backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.85)), url("https://media.istockphoto.com/id/467103541/photo/car-rental-sign.jpg?s=612x612&w=0&k=20&c=pjd-9j9Q2SttZHyARb7VEnWMRvA3XHgywGg7gwIq3vQ=" )`,
                backgroundSize: 'cover', 
                backgroundPosition: 'center',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: '#fff',
                textAlign: 'center',
            }}>
                <Container maxWidth="lg">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <Typography variant="h1" fontWeight={1000} sx={{ letterSpacing: '-3px', mb: 2, fontSize: { xs: '3rem', md: '5rem' } }}>
                            Our <span style={{ color: '#3b82f6' }}>Story</span>
                        </Typography>
                        <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: '800px', mx: 'auto', fontWeight: 400, fontSize: { xs: '1rem', md: '1.25rem' }, lineHeight: 1.6 }}>
                            Redefining the premium vehicle rental experience through innovation, trust, and elite service since 2024.
                        </Typography>
                    </motion.div>
                </Container>
            </Box>

            {/* 2. VISION SECTION - Balanced Desktop Layout */}
            <Container maxWidth="lg" sx={{ py: { xs: 12, md: 20 } }}>
                <Grid container spacing={12} alignItems="center" justifyContent="center">
                    <Grid item xs={12} md={6}>
                        <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
                            <Typography variant="overline" sx={{ color: '#3b82f6', fontWeight: 900, letterSpacing: 4 }}>ELITE MOBILITY</Typography>
                            <Typography variant="h3" fontWeight={1000} color="#1e293b" mb={4} sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' }, letterSpacing: -1 }}>Who We Are</Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 2.2, mb: 3, fontSize: '1.15rem' }}>
                                Founded in 2024, <strong>DriveEase</strong> was born from a simple mission: to make premium vehicle rentals accessible, transparent, and effortless. We bridge the gap between luxury providers and discerning customers through our advanced digital terminal.
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 2.2, fontSize: '1.15rem' }}>
                                From elite SUVs to luxury sedans, every journey with us is backed by safety, reliability, and our commitment to excellence. We don't just rent cars; we engineer premium travel experiences.
                            </Typography>
                        </motion.div>
                    </Grid>
                    
                    <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Box sx={{ position: 'relative', width: '100%', maxWidth: '550px' }}>
                            <Box 
                                component="img" 
                                src="https://old.shehurentalcars.al/wp-content/webpc-passthru.php?src=https://old.shehurentalcars.al/wp-content/uploads/2024/08/Renting-a-car-in-Albania.jpg&nocache=1" 
                                sx={{ 
                                    width: '100%', 
                                    height: 'auto',
                                    borderRadius: '40px', 
                                    boxShadow: '0 50px 100px rgba(0,0,0,0.15)',
                                    display: 'block'
                                    
                                }} 
                            />
                            {/* Floating Stats Badge */}
                            <Paper elevation={20} sx={{ 
                                position: 'absolute', 
                                bottom: -30, 
                                right: { md: -30, xs: 10 }, 
                                p: 4, 
                                borderRadius: '25px', 
                                bgcolor: '#3b82f6', 
                                color: '#fff',
                                textAlign: 'center',
                                minWidth: '180px',
                                border: '4px solid #fff'
                            }}>
                                <Typography variant="h3" fontWeight={1000}>10k+</Typography>
                                <Typography variant="caption" fontWeight={800} sx={{ textTransform: 'uppercase', letterSpacing: 1.5 }}>Verified Clients</Typography>
                            </Paper>
                        </Box>
                    </Grid>
                </Grid>
            </Container>

            {/* 3. CORE VALUES - Full Width Background Section */}
            <Box sx={{ bgcolor: '#f8fafc', py: { xs: 12, md: 18 }, width: '100%' }}>
                <Container maxWidth="lg">
                    <Box textAlign="center" mb={12}>
                        <Typography variant="h3" fontWeight={1000} color="#1e293b" mb={2}>Our Core Drivers</Typography>
                        <Typography variant="h6" color="text.secondary" fontWeight={400}>The principles that define the DriveEase excellence.</Typography>
                    </Box>
                    
                    <Grid container spacing={5} justifyContent="center">
                        {[
                            { title: 'Elite Fleet', desc: 'Hand-picked premium vehicles from certified suppliers.', icon: <DirectionsCarIcon sx={{ fontSize: 40 }} />, color: '#3b82f6' },
                            { title: 'Trust & Safety', desc: 'Advanced authentication and fully insured inventory.', icon: <VerifiedUserIcon sx={{ fontSize: 40 }} />, color: '#10b981' },
                            { title: 'Expert Support', desc: 'Dedicated agents available 24/7 for every booking.', icon: <SupportAgentIcon sx={{ fontSize: 40 }} />, color: '#f59e0b' },
                            { title: 'Innovation', desc: 'Constant improvement of our digital rental terminal.', icon: <EmojiObjectsIcon sx={{ fontSize: 40 }} />, color: '#7c3aed' },
                        ].map((val, i) => (
                            <Grid item xs={12} sm={6} md={3} key={i}>
                                <motion.div whileHover={{ y: -15 }} transition={{ duration: 0.4 }}>
                                    <Paper elevation={0} sx={{ 
                                        p: 6, 
                                        height: '100%', 
                                        borderRadius: '35px', 
                                        textAlign: 'center', 
                                        bgcolor: '#fff', 
                                        border: '1px solid #e2e8f0',
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.02)'
                                    }}>
                                        <Avatar sx={{ bgcolor: `${val.color}15`, color: val.color, width: 85, height: 85, mx: 'auto', mb: 4 }}>
                                            {val.icon}
                                        </Avatar>
                                        <Typography variant="h5" fontWeight={900} mb={2} color="#1e293b">{val.title}</Typography>
                                        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>{val.desc}</Typography>
                                    </Paper>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* 4. CALL TO ACTION */}
            <Container maxWidth="md" sx={{ py: { xs: 15, md: 25 }, textAlign: 'center' }}>
                <Typography variant="h2" fontWeight={1000} color="#1e293b" mb={4} sx={{ fontSize: { xs: '2.5rem', md: '4.5rem' }, letterSpacing: -2 }}>
                    Ready for the <span style={{ color: '#3b82f6' }}>Elite</span> Journey?
                </Typography>
                <Typography variant="h6" color="text.secondary" mb={8} sx={{ fontSize: '1.3rem', fontWeight: 400, opacity: 0.8 }}>
                    Experience the future of mobility with Sri Lanka's finest vehicle management ecosystem.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center">
                    <Button variant="contained" size="large" sx={{ 
                        px: 8, py: 2.5, borderRadius: '20px', fontWeight: 900, fontSize: '1.1rem',
                        bgcolor: '#3b82f6', '&:hover': { bgcolor: '#2563eb' },
                        boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)'
                    }}>
                        Explore the Fleet
                    </Button>
                    <Button variant="outlined" size="large" sx={{ 
                        px: 8, py: 2.5, borderRadius: '20px', fontWeight: 900, fontSize: '1.1rem',
                        color: '#1e293b', borderColor: '#1e293b', borderWidth: '2.5px',
                        '&:hover': { borderWidth: '2.5px', borderColor: '#3b82f6', color: '#3b82f6' }
                    }}>
                        Contact Sales
                    </Button>
                </Stack>
            </Container>

        </Box>
    );
};

export default AboutUs;