import React, { useState, useEffect } from 'react';
import { 
    Box, Typography, Button, Container, Grid, Stack, Paper 
} from '@mui/material'; 
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import DriveEtaIcon from '@mui/icons-material/DriveEta'; 
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import GroupsIcon from '@mui/icons-material/Groups';
import PublicIcon from '@mui/icons-material/Public';
import StarsIcon from '@mui/icons-material/Stars';
import GppGoodIcon from '@mui/icons-material/GppGood';

const FONT_FAM = "'Montserrat', sans-serif";
const HEADING_FONT = "'Syncopate', sans-serif"; 

const heroImages = [
    "https://static.vecteezy.com/system/resources/thumbnails/034/837/759/small/car-parked-at-outdoor-parking-lot-used-car-for-sale-and-rental-service-car-insurance-background-automobile-parking-area-car-dealership-and-dealer-agent-concept-automotive-industry-generative-ai-photo.jpg",
    "https://media.istockphoto.com/id/1320795558/photo/signing-on-the-agreement-term-of-car-rental-service-business-and-transportation-service.jpg?s=612x612&w=0&k=20&c=hc4z-DWUnx-O9u3AgtEQclZdFfWnO2Ch8heHJg5Q06U=",
    "https://media.istockphoto.com/id/104459344/photo/woman-sitting-in-new-status-car-and-receiving-keys.jpg?s=612x612&w=0&k=20&c=Adn1RodKbrRUmfmbVPklJCmVrqUS_K8n-KMPJwwCr2I=",
    "https://wallpapercave.com/wp/wp8664414.jpg"
];

const StatCounter = ({ endValue, suffix = "" }) => {
    const [count, setCount] = useState(0);
    const { ref, inView } = useInView({ triggerOnce: true });

    useEffect(() => {
        if (inView) {
            let start = 0;
            const duration = 2000;
            const increment = endValue / (duration / 16);
            const timer = setInterval(() => {
                start += increment;
                if (start >= endValue) {
                    setCount(endValue);
                    clearInterval(timer);
                } else {
                    setCount(Math.floor(start));
                }
            }, 16);
            return () => clearInterval(timer);
        }
    }, [inView, endValue]);

    return (
        <Typography ref={ref} variant="h3" sx={{ color: '#ff5722', fontWeight: 900, fontFamily: HEADING_FONT }}>
            {count}{suffix}
        </Typography>
    );
};

const HomePage = () => {
    const navigate = useNavigate();
    const [currentImg, setCurrentImg] = useState(0);
    const PRIMARY_ORANGE = "#ff5722"; 
    const DARK_BG = "#000000"; 

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImg((prev) => (prev + 1) % heroImages.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const fadeInUp = {
        initial: { opacity: 0, y: 40 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.8, ease: "easeOut" }
    };

    return (
        <Box sx={{ bgcolor: DARK_BG, color: '#fff', overflowX: 'hidden', fontFamily: FONT_FAM }}>
            
            {/* --- 1. HERO SLIDER SECTION (CENTERED) --- */}
            <Box sx={{ 
                height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative', textAlign: 'center', overflow: 'hidden'
            }}>
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={currentImg}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 0.4, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5 }}
                        style={{
                            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                            backgroundImage: `url(${heroImages[currentImg]})`,
                            backgroundSize: 'cover', backgroundPosition: 'center',
                            zIndex: 0
                        }}
                    />
                </AnimatePresence>

                <Box sx={{ 
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
                    background: 'radial-gradient(circle, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.95) 100%)', 
                    zIndex: 1 
                }} />

                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
                        <Stack alignItems="center" mb={2}>
                            <Typography variant="subtitle1" sx={{ 
                                color: PRIMARY_ORANGE, fontWeight: 900, letterSpacing: 12, 
                                fontFamily: HEADING_FONT, fontSize: '0.7rem' 
                            }}>
                                THE ELITE MANAGEMENT
                            </Typography>
                            <Box sx={{ width: 100, height: 2, bgcolor: PRIMARY_ORANGE, mt: 1.5 }} />
                        </Stack>
                        <Typography variant="h1" sx={{ 
                            fontWeight: 900, 
                            fontSize: { xs: '2.5rem', md: '6rem' }, 
                            lineHeight: 1, mb: 3,
                            fontFamily: HEADING_FONT,
                            letterSpacing: -2
                        }}>
                            DRIVE THE <br/> <span style={{ color: PRIMARY_ORANGE }}>FUTURE.</span>
                        </Typography>
                        <Typography variant="body1" sx={{ 
                            fontSize: '1.1rem', mb: 6, color: 'rgba(255,255,255,0.6)', 
                            maxWidth: '800px', mx: 'auto', lineHeight: 2, letterSpacing: 1
                        }}>
                            Sri Lanka's most exclusive vehicle management ecosystem. 
                            Professional luxury mobility redefined.
                        </Typography>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center" alignItems="center">
                            <Button variant="contained" onClick={() => navigate('/fleet')} 
                                sx={{ 
                                    bgcolor: PRIMARY_ORANGE, py: 2.5, px: 6, borderRadius: 0, 
                                    fontWeight: 900, fontSize: '0.8rem', letterSpacing: 2,
                                    fontFamily: HEADING_FONT, width: { xs: '250px', sm: 'auto' },
                                    '&:hover': { bgcolor: '#fff', color: '#000' } 
                                }}>
                                BOOK NOW
                            </Button>
                            <Button variant="outlined" onClick={() => navigate('/about')} 
                                sx={{ 
                                    borderColor: 'rgba(255,255,255,0.3)', color: '#fff', py: 2.5, px: 4, 
                                    borderRadius: 0, fontWeight: 900, fontSize: '0.8rem', letterSpacing: 2,
                                    fontFamily: HEADING_FONT, width: { xs: '250px', sm: 'auto' },
                                    '&:hover': { borderColor: PRIMARY_ORANGE, color: PRIMARY_ORANGE } 
                                }}>
                                OUR STORY
                            </Button>
                        </Stack>
                    </motion.div>
                </Container>
            </Box>

            {/* --- 2. STATS SECTION (Perfectly Centered Paper) --- */}
            <Box sx={{ mt: 0, position: 'relative', zIndex: 5, textAlign: 'center' }}>
                <Container maxWidth="lg">
                    <Paper sx={{ 
                        p: { xs: 4, md: 8 }, bgcolor: 'rgba(10, 10, 10, 0.95)', backdropFilter: 'blur(20px)', 
                        borderRadius: 0, border: '1px solid rgba(255,255,255,0.05)', 
                        boxShadow: '0 50px 100px rgba(0,0,0,0.8)', mx: 'auto'
                    }}>
                        <Grid container spacing={6} justifyContent="center" alignItems="center">
                            {[
                                { label: 'EXPERIENCE', val: 15, suffix: 'YRS', icon: <WorkspacePremiumIcon /> },
                                { label: 'CLIENTS', val: 10, suffix: 'K+', icon: <GroupsIcon /> },
                                { label: 'PREMIUM FLEET', val: 500, suffix: '+', icon: <DriveEtaIcon /> },
                                { label: 'AVAILABILITY', val: 100, suffix: '%', icon: <PublicIcon /> }
                            ].map((stat, index) => (
                                <Grid item xs={6} md={3} key={index}>
                                    <motion.div {...fadeInUp}>
                                        <Box sx={{ color: 'rgba(255,255,255,0.2)', mb: 1, display: 'flex', justifyContent: 'center' }}>
                                            {React.cloneElement(stat.icon, { sx: { fontSize: 35 } })}
                                        </Box>
                                        <StatCounter endValue={stat.val} suffix={stat.suffix} />
                                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 900, letterSpacing: 3, display: 'block', mt: 1 }}>
                                            {stat.label}
                                        </Typography>
                                    </motion.div>
                                </Grid>
                            ))}
                        </Grid>
                    </Paper>
                </Container>
            </Box>

            {/* --- 3. FEATURES (Centered Luxury Grid) --- */}
            <Container sx={{ py: 20 }}>
                <Box sx={{ textAlign: 'center', mb: 15 }}>
                    <motion.div {...fadeInUp}>
                        <Typography variant="h6" color={PRIMARY_ORANGE} sx={{ fontWeight: 900, letterSpacing: 6, fontSize: '0.8rem', fontFamily: HEADING_FONT }}>
                            UNMATCHED STANDARDS
                        </Typography>
                        <Typography variant="h2" sx={{ fontWeight: 900, mt: 2, mb: 3, fontFamily: HEADING_FONT, letterSpacing: -1, fontSize: { xs: '2rem', md: '3.5rem' } }}>
                            THE <span style={{ color: PRIMARY_ORANGE }}>DRIVEEASE</span> WAY
                        </Typography>
                        <Box sx={{ width: 60, height: 4, bgcolor: PRIMARY_ORANGE, mx: 'auto' }} />
                    </motion.div>
                </Box>

                <Grid container spacing={8} justifyContent="center">
                    {[
                        { icon: <DriveEtaIcon />, title: 'Elite Fleet', desc: 'Hand-picked luxury vehicles for the most demanding travelers.' },
                        { icon: <GppGoodIcon />, title: 'Safety First', desc: '150-point precision check before every single handover.' },
                        { icon: <SpeedIcon />, title: 'Rapid Sync', desc: 'Seamless booking and agent assignment in under 10 minutes.' },
                        { icon: <SupportAgentIcon />, title: 'Elite Support', desc: 'Your personal management concierge, available around the clock.' },
                        { icon: <SecurityIcon />, title: 'Secure Vault', desc: 'End-to-end encrypted booking management and data protection.' },
                        { icon: <StarsIcon />, title: 'Stars Choice', desc: 'The most awarded car rental management platform in the region.' }
                    ].map((feature, idx) => (
                        <Grid item xs={12} sm={6} md={4} key={idx}>
                            <motion.div {...fadeInUp} transition={{ delay: idx * 0.1 }}>
                                <Stack spacing={3} alignItems="center" textAlign="center">
                                    <Box sx={{ 
                                        width: 110, height: 110, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        bgcolor: '#0a0a0a', borderRadius: 0, color: PRIMARY_ORANGE,
                                        border: '1px solid rgba(255,255,255,0.05)',
                                        transition: '0.5s',
                                        '&:hover': { borderColor: PRIMARY_ORANGE, transform: 'rotateY(180deg)' }
                                    }}>
                                        {React.cloneElement(feature.icon, { sx: { fontSize: 45 } })}
                                    </Box>
                                    <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: 2, fontFamily: HEADING_FONT, fontSize: '0.85rem' }}>
                                        {feature.title.toUpperCase()}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', lineHeight: 2, px: 3, fontSize: '0.9rem' }}>
                                        {feature.desc}
                                    </Typography>
                                </Stack>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* --- 4. CALL TO ACTION (CENTERED) --- */}
            <Box sx={{ 
                py: 20, textAlign: 'center', 
                borderTop: '1px solid rgba(255,255,255,0.05)',
                background: 'linear-gradient(45deg, #000 0%, #080808 100%)'
            }}>
                <Container maxWidth="md">
                    <motion.div {...fadeInUp}>
                        <Typography variant="h2" sx={{ fontWeight: 900, mb: 4, fontFamily: HEADING_FONT, letterSpacing: -1, fontSize: { xs: '1.8rem', md: '3.5rem' } }}>
                            JOIN THE <span style={{ color: PRIMARY_ORANGE }}>EXECUTIVE</span> CIRCLE
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.5)', mb: 8, letterSpacing: 1, lineHeight: 2, px: { xs: 2, md: 10 } }}>
                            Register today to experience the pinnacle of vehicle management and luxury mobility in Sri Lanka. 
                            Exclusive access for elite members.
                        </Typography>
                        <Button variant="contained" size="large" onClick={() => navigate('/signup')}
                            sx={{ 
                                bgcolor: PRIMARY_ORANGE, color: '#fff', px: 8, py: 2.5, 
                                fontWeight: 900, borderRadius: 0, letterSpacing: 3,
                                fontFamily: HEADING_FONT, fontSize: '0.8rem',
                                '&:hover': { bgcolor: '#fff', color: '#000' } 
                            }}>
                            GET STARTED
                        </Button>
                    </motion.div>
                </Container>
            </Box>

            {/* --- 5. CENTERED FOOTER LOGO --- */}
            <Box sx={{ py: 8, textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.02)' }}>
                <Typography variant="h4" sx={{ fontFamily: HEADING_FONT, fontWeight: 900, letterSpacing: 12, opacity: 0.2 }}>
                    DRIVEEASE
                </Typography>
            </Box>
        </Box>
    );
};

export default HomePage;