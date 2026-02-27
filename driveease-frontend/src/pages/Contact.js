import React, { useState } from 'react';
import { 
    Box, Typography, Container, Grid, TextField, Button, 
    Paper, Stack, Alert, Snackbar, 
    Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
import { motion } from 'framer-motion';
import ContactService from '../api/Services/ContactService'; 
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SendIcon from '@mui/icons-material/Send';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BusinessIcon from '@mui/icons-material/Business';

const Contact = () => {
    const PRIMARY_ORANGE = "#ff5722"; 
    const DARK_BG = "#000000"; 

    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', subject: '', message: ''
    });

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [status, setStatus] = useState({ type: 'success', message: '' });

    const fadeInUp = {
        initial: { opacity: 0, y: 40 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.8, ease: "easeOut" }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSend = async (e) => {
        e.preventDefault();
        try {
            const response = await ContactService.sendMessage(formData);
            if (response.status === 200) {
                setStatus({ type: 'success', message: 'Message Sent Successfully!' });
                setOpenSnackbar(true);
                setFormData({ firstName: '', lastName: '', email: '', subject: '', message: '' });
            }
        } catch (error) {
            setStatus({ type: 'error', message: 'Failed to send message.' });
            setOpenSnackbar(true);
        }
    };

    return (
        <Box sx={{ bgcolor: DARK_BG, minHeight: '100vh', color: '#fff', pb: 10 }}>
            
            {/* --- 1. HERO HEADER WITH BACKGROUND IMAGE (Priyankara Style) --- */}
            <Box sx={{ 
                height: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundImage: 'url("https://images.pexels.com/photos/3311574/pexels-photo-3311574.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")',
                backgroundSize: 'cover', backgroundPosition: 'center',
                position: 'relative', textAlign: 'center'
            }}>
                {/* Dark Overlay for Readability */}
                <Box sx={{ 
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, #000 100%)', 
                    zIndex: 1 
                }} />

                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
                        <Typography variant="h6" sx={{ color: PRIMARY_ORANGE, fontWeight: 800, letterSpacing: 8, mb: 1 }}>
                            CONNECT WITH THE ELITE
                        </Typography>
                        <Typography variant="h2" fontWeight="900">GET IN <span style={{ color: PRIMARY_ORANGE }}>TOUCH</span></Typography>
                        <Box sx={{ width: 80, height: 4, bgcolor: PRIMARY_ORANGE, mx: 'auto', mt: 3 }} />
                    </motion.div>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ mt: -10, position: 'relative', zIndex: 3 }}>
                <Grid container spacing={0} sx={{ boxShadow: '0 50px 100px rgba(0,0,0,0.5)', borderRadius: 0, overflow: 'hidden' }}>
                    
                    {/* --- 2. CONTACT INFO --- */}
                    <Grid item xs={12} md={5} sx={{ bgcolor: '#0a0a0a', p: { xs: 6, md: 8 }, borderRight: '1px solid rgba(255,255,255,0.05)' }}>
                        <Typography variant="h4" fontWeight="900" sx={{ mb: 4 }}>Elite Support</Typography>
                        <Typography variant="body1" sx={{ mb: 6, color: 'rgba(255,255,255,0.5)', lineHeight: 1.8 }}>
                            Our dedicated agents are available 24/7 to ensure your luxury travel experience is seamless.
                        </Typography>
                        
                        <Stack spacing={4}>
                            {[
                                { icon: <PhoneIcon />, label: "PHONE", val: "+94 11 234 5678" },
                                { icon: <EmailIcon />, label: "EMAIL", val: "support@driveease.lk" },
                                { icon: <LocationOnIcon />, label: "OFFICE", val: "Galle Road, Colombo 03" }
                            ].map((item, i) => (
                                <Stack key={i} direction="row" spacing={3} alignItems="center">
                                    <Box sx={{ color: PRIMARY_ORANGE }}>{item.icon}</Box>
                                    <Box>
                                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', fontWeight: 'bold' }}>{item.label}</Typography>
                                        <Typography variant="h6" fontWeight="bold">{item.val}</Typography>
                                    </Box>
                                </Stack>
                            ))}
                        </Stack>
                    </Grid>

                    {/* --- 3. MESSAGE FORM --- */}
                    <Grid item xs={12} md={7} sx={{ bgcolor: '#111', p: { xs: 6, md: 8 } }}>
                        <motion.div {...fadeInUp}>
                            <Typography variant="h4" fontWeight="900" sx={{ mb: 4 }}>Send a Message</Typography>
                            <form onSubmit={handleSend}>
                                <Grid container spacing={4}>
                                    <Grid item xs={12} sm={6}><TextField fullWidth name="firstName" label="FIRST NAME" variant="standard" required value={formData.firstName} onChange={handleChange} sx={{ input: { color: 'white' }, label: { color: 'gray' } }}/></Grid>
                                    <Grid item xs={12} sm={6}><TextField fullWidth name="lastName" label="LAST NAME" variant="standard" value={formData.lastName} onChange={handleChange} sx={{ input: { color: 'white' }, label: { color: 'gray' } }}/></Grid>
                                    <Grid item xs={12}><TextField fullWidth name="email" label="EMAIL ADDRESS" variant="standard" type="email" required value={formData.email} onChange={handleChange} sx={{ input: { color: 'white' }, label: { color: 'gray' } }}/></Grid>
                                    <Grid item xs={12}><TextField fullWidth name="message" label="HOW CAN WE HELP?" variant="standard" multiline rows={4} required value={formData.message} onChange={handleChange} sx={{ textarea: { color: 'white' }, label: { color: 'gray' } }}/></Grid>
                                    <Grid item xs={12} sx={{ mt: 2 }}>
                                        <Button type="submit" variant="contained" size="large" endIcon={<SendIcon />} sx={{ bgcolor: PRIMARY_ORANGE, color: '#fff', px: 6, py: 2, borderRadius: 0, fontWeight: 'bold', '&:hover': { bgcolor: '#fff', color: '#000' } }}>SEND MESSAGE</Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </motion.div>
                    </Grid>
                </Grid>
            </Container>

            {/* --- 4. BRANCH LOCATIONS --- */}
            <Container maxWidth="lg" sx={{ mt: 15 }}>
                <Typography variant="h4" fontWeight="900" textAlign="center" mb={8}>OUR <span style={{ color: PRIMARY_ORANGE }}>BRANCHES</span></Typography>
                <Grid container spacing={4}>
                    {[
                        { city: "Colombo HQ", addr: "123 Galle Rd, Colombo 03", phone: "+94 11 234 5678" },
                        { city: "Kandy Branch", addr: "45 Peradeniya Rd, Kandy", phone: "+94 81 234 5678" },
                        { city: "Galle Hub", addr: "12 Marine Drive, Galle", phone: "+94 91 234 5678" }
                    ].map((branch, i) => (
                        <Grid item xs={12} md={4} key={i}>
                            <motion.div {...fadeInUp}>
                                <Paper sx={{ p: 4, bgcolor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 0 }}>
                                    <BusinessIcon sx={{ color: PRIMARY_ORANGE, mb: 2 }} />
                                    <Typography variant="h6" fontWeight="bold" gutterBottom>{branch.city}</Typography>
                                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>{branch.addr}</Typography>
                                    <Typography variant="body2" sx={{ color: PRIMARY_ORANGE, mt: 1 }}>{branch.phone}</Typography>
                                </Paper>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* --- 5. FAQ SECTION --- */}
            <Container maxWidth="md" sx={{ mt: 15 }}>
                <Typography variant="h4" fontWeight="900" textAlign="center" mb={8}>FREQUENT <span style={{ color: PRIMARY_ORANGE }}>QUESTIONS</span></Typography>
                {[
                    { q: "What documents do I need to rent a car?", a: "You need a valid driving license, NIC or Passport, and a billing proof." },
                    { q: "Is there a mileage limit?", a: "Most of our luxury rentals come with a 100km/day limit. Extra km charges apply." },
                    { q: "Do you provide chauffeurs?", a: "Yes, we provide professionally trained chauffeurs for all vehicle types upon request." }
                ].map((faq, i) => (
                    <Accordion key={i} sx={{ bgcolor: '#0a0a0a', color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.05)', mb: 1 }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: PRIMARY_ORANGE }} />}>
                            <Typography fontWeight="bold">{faq.q}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography sx={{ color: 'rgba(255,255,255,0.6)' }}>{faq.a}</Typography>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Container>

            {/* --- 6. MAP --- */}
            <Container maxWidth="lg" sx={{ mt: 15, mb: 10 }}>
                <motion.div {...fadeInUp}>
                    <Paper sx={{ height: '500px', borderRadius: 0, border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                        <iframe title="Map" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.844390509653!2d79.848261314772!3d6.9092899950076!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae25940989063fd%3A0x63351984a9561066!2sColombo%2003!5e0!3m2!1sen!2slk!4v1645851458925!5m2!1sen!2slk" width="100%" height="100%" style={{ border: 0, filter: 'grayscale(1) invert(1) contrast(1.2)' }} loading="lazy"></iframe>
                    </Paper>
                </motion.div>
            </Container>

            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
                <Alert onClose={() => setOpenSnackbar(false)} severity={status.type} sx={{ width: '100%', bgcolor: status.type === 'success' ? PRIMARY_ORANGE : '#f44336', color: '#fff' }}>
                    {status.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Contact;