import React from 'react';
import { 
    Box, Typography, Container, Grid, Button, Card, Stack, Divider 
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import PublicIcon from '@mui/icons-material/Public';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

const About = () => {
    const navigate = useNavigate();
    const PRIMARY_ORANGE = "#ff5722"; 
    const DARK_BG = "#000000"; 

    const fadeInUp = {
        initial: { opacity: 0, y: 40 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.8, ease: "easeOut" }
    };

    return (
        <Box sx={{ bgcolor: DARK_BG, color: '#fff', overflowX: 'hidden' }}>
            
            {/* --- 1. HERO SECTION (Perfectly Centered) --- */}
            <Box sx={{ 
                height: '75vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, #000 100%), url("https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600")',
                backgroundSize: 'cover', backgroundPosition: 'center',
                textAlign: 'center', position: 'relative'
            }}>
                <Container maxWidth="md">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }}>
                        <Typography variant="h6" sx={{ color: PRIMARY_ORANGE, fontWeight: 800, letterSpacing: 8, mb: 2 }}>
                            ESTABLISHED 2026
                        </Typography>
                        <Typography variant="h1" fontWeight="900" sx={{ fontSize: { xs: '3rem', md: '5.5rem' }, mb: 3, lineHeight: 1 }}>
                            THE <span style={{ color: PRIMARY_ORANGE }}>DRIVEEASE</span> LEGACY
                        </Typography>
                        <Box sx={{ width: 100, height: 4, bgcolor: PRIMARY_ORANGE, mx: 'auto' }} />
                    </motion.div>
                </Container>
            </Box>

            {/* --- 2. OUR JOURNEY (Centered Text & Stats) --- */}
            <Container sx={{ py: { xs: 10, md: 15 }, textAlign: 'center' }}>
                <motion.div {...fadeInUp}>
                    <Typography variant="h4" fontWeight="bold" sx={{ color: PRIMARY_ORANGE, mb: 1 }}>OUR JOURNEY</Typography>
                    <Typography variant="h3" fontWeight="900" sx={{ mb: 4 }}>REDEFINING LUXURY MOBILITY</Typography>
                    
                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.6)', lineHeight: 2, mb: 8, fontSize: '1.15rem', maxWidth: '850px', mx: 'auto' }}>
                        DriveEase was founded on the principle that premium travel should be accessible and stress-free. 
                        We bridge the gap between world-class vehicle providers and travelers who demand excellence. 
                        Our journey began with a single mission: to transform car rentals into a premium, managed experience.
                    </Typography>

                    {/* --- CENTERED STATS --- */}
                    <Stack 
                        direction={{ xs: 'column', sm: 'row' }} 
                        spacing={{ xs: 5, sm: 10 }} 
                        justifyContent="center" 
                        alignItems="center" 
                        sx={{ mb: 10 }}
                    >
                        <Box>
                            <Typography variant="h2" fontWeight="900" color={PRIMARY_ORANGE}>500+</Typography>
                            <Typography variant="overline" sx={{ opacity: 0.5, letterSpacing: 2 }}>PREMIUM FLEET</Typography>
                        </Box>
                        <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255,255,255,0.1)', display: { xs: 'none', sm: 'block' } }} />
                        <Box>
                            <Typography variant="h2" fontWeight="900" color={PRIMARY_ORANGE}>25k+</Typography>
                            <Typography variant="overline" sx={{ opacity: 0.5, letterSpacing: 2 }}>HAPPY CLIENTS</Typography>
                        </Box>
                        <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255,255,255,0.1)', display: { xs: 'none', sm: 'block' } }} />
                        <Box>
                            <Typography variant="h2" fontWeight="900" color={PRIMARY_ORANGE}>100%</Typography>
                            <Typography variant="overline" sx={{ opacity: 0.5, letterSpacing: 2 }}>RELIABILITY</Typography>
                        </Box>
                    </Stack>

                    {/* --- CENTERED IMAGE BOX --- */}
                    <Box sx={{ position: 'relative', display: 'inline-block', maxWidth: '1000px', width: '100%' }}>
                        <Box sx={{ 
                            border: `2px solid ${PRIMARY_ORANGE}`, position: 'absolute', 
                            top: 25, left: 25, width: '100%', height: '100%', zIndex: 0 
                        }} />
                        <img 
                            src="https://holacarrentals.com/cdn/shop/articles/negotiating-car-hire-upgrade-us-counter-1.jpg?v=1766519384" 
                            alt="Elite Experience" 
                            style={{ width: '100%', position: 'relative', zIndex: 1, filter: 'grayscale(0.3)' }} 
                        />
                    </Box>
                </motion.div>
            </Container>

            {/* --- 3. CORE PILLARS SECTION (Centered Grid) --- */}
            <Box sx={{ bgcolor: '#050505', py: 15, borderY: '1px solid rgba(255,255,255,0.05)' }}>
                <Container>
                    <Typography variant="h3" textAlign="center" fontWeight="900" sx={{ mb: 10 }}>
                        ELITE <span style={{ color: PRIMARY_ORANGE }}>SERVICE</span> STANDARDS
                    </Typography>
                    <Grid container spacing={4} justifyContent="center">
                        {[
                            { icon: <WorkspacePremiumIcon />, title: 'Premium Assurance', desc: 'Every vehicle in our diverse fleet undergoes rigorous 150-point safety and quality checks.' },
                            { icon: <SupportAgentIcon />, title: 'Agent-Led Service', desc: 'Our unique agent system ensures you have a dedicated personal contact for every booking.' },
                            { icon: <DirectionsCarIcon />, title: 'Diverse Fleet', desc: 'From luxury sedans for corporate excellence to rugged SUVs for your hill country adventures.' }
                        ].map((item, index) => (
                            <Grid item xs={12} md={4} key={index}>
                                <motion.div {...fadeInUp} transition={{ delay: index * 0.2 }}>
                                    <Card sx={{ 
                                        height: '100%', bgcolor: 'transparent', border: '1px solid rgba(255,255,255,0.05)', 
                                        borderRadius: 0, p: 5, textAlign: 'center', transition: '0.4s',
                                        '&:hover': { bgcolor: '#0a0a0a', borderColor: PRIMARY_ORANGE, transform: 'translateY(-10px)' } 
                                    }}>
                                        <Box sx={{ color: PRIMARY_ORANGE, mb: 3 }}>
                                            {React.cloneElement(item.icon, { sx: { fontSize: 60 } })}
                                        </Box>
                                        <Typography variant="h5" fontWeight="bold" gutterBottom color="#fff">{item.title}</Typography>
                                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.8 }}>{item.desc}</Typography>
                                    </Card>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* --- 4. TRUST & CTA SECTION (Fully Balanced) --- */}
            <Container sx={{ py: 15, textAlign: 'center' }}>
                <Grid container spacing={8} justifyContent="center">
                    <Grid item xs={12} md={10}>
                        <Stack spacing={6} alignItems="center">
                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} justifyContent="center">
                                <Stack direction="row" spacing={2} alignItems="center" sx={{ textAlign: 'left' }}>
                                    <PublicIcon sx={{ color: PRIMARY_ORANGE, fontSize: 45 }} />
                                    <Box>
                                        <Typography variant="h6" fontWeight="bold">Island-wide Network</Typography>
                                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>Pickups at all major airports and cities.</Typography>
                                    </Box>
                                </Stack>
                                <Stack direction="row" spacing={2} alignItems="center" sx={{ textAlign: 'left' }}>
                                    <VerifiedUserIcon sx={{ color: PRIMARY_ORANGE, fontSize: 45 }} />
                                    <Box>
                                        <Typography variant="h6" fontWeight="bold">Secure Reliability</Typography>
                                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>Transparent pricing with zero hidden fees.</Typography>
                                    </Box>
                                </Stack>
                            </Stack>

                            <Box>
                                <Typography variant="h4" fontWeight="900" sx={{ mb: 3 }}>READY FOR THE NEXT DRIVE?</Typography>
                                <Button 
                                    variant="contained" 
                                    size="large"
                                    onClick={() => navigate('/fleet')}
                                    sx={{ 
                                        bgcolor: PRIMARY_ORANGE, color: '#fff', px: 10, py: 2.5, 
                                        borderRadius: 0, fontWeight: '900', letterSpacing: 2,
                                        '&:hover': { bgcolor: '#fff', color: '#000' } 
                                    }}
                                >
                                    EXPLORE THE FLEET
                                </Button>
                            </Box>
                        </Stack>
                    </Grid>
                </Grid>
            </Container>

            {/* --- 5. CENTERED FOOTER TEXT --- */}
            <Box sx={{ py: 12, textAlign: 'center', background: 'linear-gradient(to top, #111 0%, #000 100%)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <Typography variant="h3" fontWeight="900" color={PRIMARY_ORANGE} sx={{ mb: 2, opacity: 0.8, letterSpacing: 4 }}>DRIVEEASE</Typography>
                <Typography variant="overline" sx={{ opacity: 0.4, letterSpacing: 6 }}>PROFESSIONALISM • LUXURY • TRUST</Typography>
            </Box>

        </Box>
    );
};

export default About;