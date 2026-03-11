import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, Stack, IconButton, Grid, Container, TextField, MenuItem, Paper, Divider
} from '@mui/material';
import { useTheme } from '@mui/material/styles'; 
import { motion, useScroll, useSpring } from 'framer-motion'; 
import { useInView } from 'react-intersection-observer'; 
import { useNavigate } from 'react-router-dom';
import { authService } from '../api/authService'; // 🔥 Added authService

// Icons
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FlightIcon from '@mui/icons-material/Flight';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions'; 
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'; 
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CarRentalIcon from '@mui/icons-material/CarRental';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import GppGoodIcon from '@mui/icons-material/GppGood';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import StarsIcon from '@mui/icons-material/Stars';

// --- STAT COUNTER COMPONENT ---
const StatCounter = ({ value, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true });

  useEffect(() => {
    if (inView) {
      let start = 0;
      const end = parseInt(value);
      const duration = 2000;
      const increment = end / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [inView, value]);

  return <span ref={ref}>{count}{suffix}</span>;
};

const Home = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // 🔥 Role-based Navigation Logic for BOOK NOW
  const handleBookNowClick = () => {
    if (authService.isAuthenticated()) {
      const role = authService.getUserRole();
      if (role === 'ADMIN') {
        authService.logoutUser();
        navigate('/login');
      } else if (role === 'AGENT') {
        navigate('/agent-dashboard');
      } else if (role === 'CUSTOMER') {
        navigate('/fleet-portal');
      }
    } else {
      navigate('/login');
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeOut" },
    viewport: { once: true, margin: "-100px" } 
  };

  const scaleUp = {
    initial: { opacity: 0, scale: 0.95 },
    whileInView: { opacity: 1, scale: 1 },
    transition: { duration: 0.6, ease: "easeOut" },
    viewport: { once: true } 
  };

  return (
    <Box sx={{ width: '100vw', overflowX: 'hidden', bgcolor: theme.palette.background.default, fontFamily: '"Inter", sans-serif' }}>
      
      <motion.div style={{ scaleX, position: 'fixed', top: 0, left: 0, right: 0, height: 4, backgroundColor: theme.palette.secondary.main, originX: 0, zIndex: 2000 }} />

      {/* 1. HERO SECTION */}
      <Box sx={{ 
        position: 'relative', 
        bgcolor: theme.palette.text.primary, 
        minHeight: '100vh', 
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background: `radial-gradient(circle at 80% 20%, rgba(0, 82, 204, 0.15) 0%, transparent 40%), 
                     radial-gradient(circle at 10% 80%, rgba(245, 0, 87, 0.1) 0%, transparent 40%)`,
      }}>
        <Box sx={{
          position: 'absolute', top: '-10%', left: '-5%', width: '55%', height: '100%',
          bgcolor: theme.palette.background.paper, 
          borderRadius: '0 45% 55% 0 / 0 100% 100% 0',
          zIndex: 0, boxShadow: '20px 0 60px rgba(0,0,0,0.1)'
        }} />

        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, pt: { xs: 10, md: 18 }, pb: 8 }}>
          <Grid container spacing={25} alignItems="center">
            <Grid item xs={12} md={5}>
              <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                <Typography sx={{ color: theme.palette.primary.main, fontWeight: 800, mb: 1.5, letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.8rem' }}>Elite Car Rental</Typography>
                <Typography variant="h1" sx={{ fontSize: { xs: '3rem', md: '5rem' }, fontWeight: 950, lineHeight: 1.1, mb: 3, color: theme.palette.text.primary }}>
                  Luxury <span style={{ color: theme.palette.secondary.main }}>Cars</span><br />For rent
                </Typography>
                <Typography sx={{ color: theme.palette.text.secondary, maxWidth: '500px', mb: 5, fontSize: '1.1rem', lineHeight: 1.8 }}>
                  Experience the ultimate comfort and performance. Select from our exclusive collection for your next journey.
                </Typography>
                <Stack direction="row" spacing={3}>
                  {/* 🔥 Updated Button with Logic */}
                  <Button onClick={handleBookNowClick} component={motion.button} whileHover={{ scale: 1.05 }} variant="contained" size="large" sx={{ borderRadius: '15px', px: 5, py: 2, fontWeight: 800 }}>BOOK NOW</Button>
                  <Button onClick={() => navigate('/fleet-portal')} variant="outlined" size="large" sx={{ borderRadius: '15px', px: 4, fontWeight: 800, borderWidth: '2px', color: theme.palette.text.primary, borderColor: theme.palette.text.primary }}>EXPLORE FLEET</Button>
                </Stack>
              </motion.div>
            </Grid>
            
            <Grid item xs={12} md={7} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
               <motion.div variants={scaleUp} initial="initial" animate="whileInView" whileHover={{ y: -10 }}>
                  <Box sx={{
                    position: 'relative', width: { xs: '100%', md: '500px' }, height: { xs: '350px', md: '500px' },
                    borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%', overflow: 'hidden',
                    border: `12px solid ${theme.palette.text.primary}`, boxShadow: '0 40px 100px rgba(0,0,0,0.5)',
                    mr: { md: -5 }
                  }}>
                    <img 
                      src="https://dailygenius.com/wp-content/uploads/2017/08/eldan_635x357.jpg" 
                      alt="Car" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} 
                    />
                    <Paper sx={{ position: 'absolute', bottom: '15%', left: '50%', transform: 'translateX(-50%)', bgcolor: '#FFD700', color: 'black', px: 3, py: 1, fontWeight: 950, border: '2px solid black', borderRadius: '4px' }}>DRIVE-EASE</Paper>
                  </Box>
               </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 2. SEARCH BAR / FIND CAR */}
      <Box sx={{ mt: -7, mb: 15, position: 'relative', zIndex: 10 }}>
        <Container maxWidth="lg">
          <motion.div variants={fadeInUp} initial="initial" whileInView="whileInView">
            <Paper elevation={20} sx={{ 
              p: { xs: 3, md: 5 }, borderRadius: '35px', background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.3)', boxShadow: '0 30px 60px -12px rgba(0,0,0,0.25)' 
            }}>
              <Grid container spacing={4} alignItems="center">
                <Grid item xs={12} md={3.5}><TextField fullWidth label="Search Vehicle" variant="standard" placeholder="Vehicle Name?" InputProps={{ sx: { fontWeight: 700 } }} /></Grid>
                <Grid item xs={12} md={3}><TextField fullWidth select label="Category" defaultValue="Luxury" variant="standard" InputProps={{ sx: { fontWeight: 700 } }}><MenuItem value="Luxury">Luxury Sports</MenuItem><MenuItem value="SUV">Premium SUV</MenuItem></TextField></Grid>
                <Grid item xs={12} md={3}><TextField fullWidth label="Pick-up Date" type="date" InputLabelProps={{ shrink: true }} variant="standard" InputProps={{ sx: { fontWeight: 700 } }} /></Grid>
                <Grid item xs={12} md={2.5}>
                  <Button onClick={() => navigate('/fleet-portal')} fullWidth variant="contained" size="large" sx={{ height: '60px', borderRadius: '16px', fontWeight: 900 }}>FIND CAR</Button>
                </Grid>
              </Grid>
            </Paper>
          </motion.div>
        </Container>
      </Box>

      {/* 3. STATS SECTION */}
      <Container maxWidth="lg" sx={{ mb: 15 }}>
        <Grid container spacing={4} justifyContent="center">
          {[
            { icon: <DirectionsCarIcon fontSize="large" color="primary" />, val: "250", suffix: "+", lab: "Premium Vehicles" },
            { icon: <EmojiEmotionsIcon fontSize="large" color="secondary" />, val: "30", suffix: "k+", lab: "Happy Customers" },
            { icon: <VerifiedUserIcon fontSize="large" color="primary" />, val: "10", suffix: "+", lab: "Years Experience" },
            { icon: <FlightIcon fontSize="large" color="secondary" />, val: "15", suffix: "+", lab: "Airport Locations" }
          ].map((s, i) => (
            <Grid item xs={6} md={3} key={i} textAlign="center">
              <motion.div variants={fadeInUp} initial="initial" whileInView="whileInView" transition={{ delay: i * 0.1 }}>
                <Box sx={{ mb: 2, display: 'inline-flex', p: 2, borderRadius: '20px', bgcolor: 'rgba(0,0,0,0.03)' }}>{s.icon}</Box>
                <Typography variant="h3" sx={{ fontWeight: 900, mb: 0.5, color: theme.palette.text.primary }}>
                  <StatCounter value={s.val} suffix={s.suffix} />
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '1.5px' }}>{s.lab}</Typography>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* 4. WHY CHOOSE US */}
      <Box sx={{ py: 15, bgcolor: theme.palette.background.default }}>
        <Container maxWidth="lg">
          <motion.div variants={fadeInUp} initial="initial" whileInView="whileInView" style={{ textAlign: 'center' }}>
            <Typography variant="h6" color="primary" sx={{ fontWeight: 900, mb: 2, letterSpacing: '3px' }}>WHY DRIVE-EASE</Typography>
            <Typography variant="h2" sx={{ fontWeight: 950, mb: 8 }}>The Premium Advantage</Typography>
            <Grid container spacing={3} sx={{ mb: 10 }} justifyContent="center">
              {["No hidden fees", "Luxury fleet", "24/7 Support", "Flexible Pickups"].map((p, i) => (
                <Grid item xs={12} sm={6} md={3} key={i}>
                  <motion.div whileHover={{ scale: 1.05, y: -5 }}>
                    <Paper sx={{ p: 4, borderRadius: '24px', border: `1px solid ${theme.palette.divider}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, bgcolor: 'background.paper' }}>
                      <CheckCircleIcon color="secondary" />
                      <Typography sx={{ fontWeight: 800, fontSize: '1rem', whiteSpace: 'nowrap' }}>{p}</Typography>
                    </Paper>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
            <Box sx={{ position: 'relative' }}>
               <img src="https://safedrivecarrentals.com.au/wp-content/uploads/2023/12/Car-Rental-2.png" alt="Support" style={{ width: '100%', height: '500px', objectFit: 'cover', borderRadius: '50px', boxShadow: '0 40px 80px rgba(0,0,0,0.15)' }} />
               <motion.div initial={{ y: 20 }} animate={{ y: 0 }} transition={{ repeat: Infinity, repeatType: "reverse", duration: 2 }}>
                 <Paper sx={{ position: 'absolute', bottom: '-40px', left: '50%', x: '-50%', p: 4, borderRadius: '30px', bgcolor: theme.palette.text.primary, color: 'white', display: 'flex', alignItems: 'center', gap: 3, minWidth: { md: '450px' }, boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>
                    <SupportAgentIcon sx={{ fontSize: 60, color: theme.palette.secondary.main }} />
                    <Box textAlign="left">
                      <Typography variant="h3" sx={{ fontWeight: 900, lineHeight: 1 }}>24/7</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700, opacity: 0.8 }}>Premium Support Center</Typography>
                    </Box>
                 </Paper>
               </motion.div>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* 5. HOW IT WORKS */}
      <Box sx={{ py: 20, bgcolor: theme.palette.background.paper }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 12 }}>
            <Typography variant="h6" color="primary" sx={{ fontWeight: 900, mb: 2, letterSpacing: '3px' }}>OUR PROCESS</Typography>
            <Typography variant="h2" sx={{ fontWeight: 950 }}>How It Works</Typography>
          </Box>
          <Grid container spacing={4} justifyContent="center">
            {[
              { icon: <LocationOnIcon sx={{ fontSize: 50 }} />, step: "01", title: "Choose Location", desc: "Select your preferred pick-up point." },
              { icon: <CalendarMonthIcon sx={{ fontSize: 40 }} />, step: "02", title: "Pick Date & Time", desc: "Select your perfect schedule." },
              { icon: <CarRentalIcon sx={{ fontSize: 50 }} />, step: "03", title: "Book Your Car", desc: "Pick your luxury vehicle." },
              { icon: <GppGoodIcon sx={{ fontSize: 50 }} />, step: "04", title: "Safety Check", desc: "Our team ensures a safe ride." },
              { icon: <ThumbUpIcon sx={{ fontSize: 50 }} />, step: "05", title: "Confirm & Go", desc: "Get your keys and start driving." },
              { icon: <StarsIcon sx={{ fontSize: 50 }} />, step: "06", title: "Enjoy Ride", desc: "Experience premium comfort." }
            ].map((step, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.15 }}>
                  <Box sx={{ 
                    p: 6, borderRadius: '50px', bgcolor: 'background.default', textAlign: 'center', position: 'relative', 
                    border: `2px solid ${theme.palette.divider}`, 
                    transition: 'all 0.4s ease',
                    mb: 4,
                    '&:hover': { borderColor: theme.palette.primary.main, transform: 'translateY(-15px)', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' } 
                  }}>
                    <Box sx={{ position: 'absolute', top: -35, left: '50%', x: '-50%', bgcolor: theme.palette.primary.main, color: 'white', width: '70px', height: '70px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.5rem', boxShadow: '0 15px 30px rgba(0,0,0,0.2)' }}>{step.step}</Box>
                    <Box sx={{ color: 'secondary.main', mb: 4, mt: 2 }}>{step.icon}</Box>
                    <Typography variant="h4" sx={{ fontWeight: 900, mb: 3, fontSize: '1.2rem' }}>{step.title}</Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 700, fontSize: '0.9rem' }}>{step.desc}</Typography>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

    </Box>
  );
};

export default Home;