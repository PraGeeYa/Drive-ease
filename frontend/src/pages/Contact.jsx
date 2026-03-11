import React, { useState } from 'react';
import { 
    Box, Container, Grid, Typography, Stack, TextField, 
    Button, Paper, Avatar, Snackbar, Alert, CircularProgress 
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import apiClient from '../api/axiosConfig';

const Contact = () => {
    const theme = useTheme();

    // --- STATES ---
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        subject: 'General Inquiry', 
        message: ''
    });

    // --- HANDLERS ---
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.firstName || !formData.email || !formData.message) {
            setSnackbar({ open: true, message: "Please fill all required fields!", severity: 'warning' });
            return;
        }

        try {
            setLoading(true);
            // 🔥 Request path matches SecurityConfig permitAll
            const response = await apiClient.post('/contact/send', formData);
            
            if (response.status === 200) {
                setSnackbar({ open: true, message: "Message sent successfully!", severity: 'success' });
                setFormData({ firstName: '', lastName: '', email: '', subject: 'General Inquiry', message: '' });
            }
        } catch (err) {
            console.error("Contact Error:", err);
            setSnackbar({ open: true, message: "Failed to send message. Try again!", severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        // 🔥 Root Box is 100% width to remove side gaps
        <Box sx={{ width: '100%', bgcolor: '#f8fafc', minHeight: '100vh', py: { xs: 5, md: 10 }, m: 0 }}>
            <Container maxWidth="lg">
                <Paper elevation={0} sx={{ 
                    borderRadius: '40px', 
                    overflow: 'hidden', 
                    boxShadow: '0 40px 100px rgba(0,0,0,0.08)',
                    width: '100%' 
                }}>
                    <Grid container>
                        {/* LEFT SECTION: CONTACT INFO */}
                        <Grid item xs={12} md={5} sx={{ p: { xs: 4, md: 8 }, bgcolor: '#fff' }}>
                            <Typography variant="h3" fontWeight={1000} color="#1e293b" mb={2} sx={{ letterSpacing: -1 }}>Get in Touch</Typography>
                            <Typography variant="body1" color="text.secondary" mb={6}>Experience premium support for your elite journeys.</Typography>
                            
                            <Stack spacing={5}>
                                <Box display="flex" alignItems="center" gap={3}>
                                    <Avatar sx={{ bgcolor: '#3b82f615', color: '#3b82f6', width: 56, height: 56 }}><PhoneIcon /></Avatar>
                                    <Box>
                                        <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>Hotline</Typography>
                                        <Typography variant="h6" fontWeight={800} color="#1e293b">+94 112 555 888</Typography>
                                    </Box>
                                </Box>
                                <Box display="flex" alignItems="center" gap={3}>
                                    <Avatar sx={{ bgcolor: '#3b82f615', color: '#3b82f6', width: 56, height: 56 }}><EmailIcon /></Avatar>
                                    <Box>
                                        <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>Official Email</Typography>
                                        <Typography variant="h6" fontWeight={800} color="#1e293b">info@driveease.com</Typography>
                                    </Box>
                                </Box>
                            </Stack>
                        </Grid>

                        {/* RIGHT SECTION: MODERN FORM (Matches image style) */}
                        <Grid item xs={12} md={7} sx={{ p: { xs: 4, md: 8 }, bgcolor: '#f1f5f9' }}>
                            <Typography variant="h4" fontWeight={1000} color="#1e293b" mb={1} sx={{ letterSpacing: -1 }}>Ask us anything</Typography>
                            <Typography variant="body2" color="text.secondary" mb={5}>Our experts will respond within 24 hours.</Typography>
                            
                            <Grid container spacing={3} component="form" onSubmit={handleSubmit}>
                                <Grid item xs={12} sm={6}>
                                    <TextField 
                                        fullWidth name="firstName" label="First name" variant="filled" 
                                        value={formData.firstName} onChange={handleChange}
                                        InputProps={{ disableUnderline: true, sx: { borderRadius: '15px', bgcolor: '#fff', '&:hover': { bgcolor: '#fff' } } }} 
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField 
                                        fullWidth name="lastName" label="Last name" variant="filled" 
                                        value={formData.lastName} onChange={handleChange}
                                        InputProps={{ disableUnderline: true, sx: { borderRadius: '15px', bgcolor: '#fff', '&:hover': { bgcolor: '#fff' } } }} 
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField 
                                        fullWidth name="email" label="Email Address" variant="filled" type="email"
                                        value={formData.email} onChange={handleChange}
                                        InputProps={{ disableUnderline: true, sx: { borderRadius: '15px', bgcolor: '#fff', '&:hover': { bgcolor: '#fff' } } }} 
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField 
                                        fullWidth name="message" multiline rows={5} label="How can we help?" variant="filled" 
                                        value={formData.message} onChange={handleChange}
                                        InputProps={{ disableUnderline: true, sx: { borderRadius: '15px', bgcolor: '#fff', '&:hover': { bgcolor: '#fff' } } }} 
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button 
                                        fullWidth type="submit" variant="contained" disabled={loading}
                                        sx={{ 
                                            py: 2.5, borderRadius: '18px', fontWeight: 900, 
                                            textTransform: 'none', fontSize: '1.1rem',
                                            bgcolor: '#0029ff', '&:hover': { bgcolor: '#001fd1' },
                                            boxShadow: '0 10px 30px rgba(0, 41, 255, 0.2)'
                                        }}
                                    >
                                        {loading ? <CircularProgress size={26} color="inherit" /> : "Send Message"}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>

            <Snackbar open={snackbar.open} autoHideDuration={5000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                <Alert severity={snackbar.severity} sx={{ borderRadius: '15px', fontWeight: 700, width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Contact;