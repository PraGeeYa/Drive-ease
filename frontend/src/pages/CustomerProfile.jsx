import React, { useState, useEffect } from 'react';
import { 
    Box, Typography, Paper, TextField, Button, Avatar, 
    Stack, Container, Grid, Divider, Snackbar, Alert, CircularProgress,
    IconButton, InputAdornment, Skeleton, 
    Chip // 🔥 FIXED: Added Chip to imports
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';
import SaveIcon from '@mui/icons-material/Save';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import LockIcon from '@mui/icons-material/Lock';
import EditIcon from '@mui/icons-material/Edit';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import apiClient from '../api/axiosConfig';
import { authService } from '../api/authService';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; 

const CustomerProfile = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Profile States
    const [profile, setProfile] = useState({
        username: '',
        email: '',
        phoneNumber: '', 
        role: 'CUSTOMER'
    });

    // Password States
    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    useEffect(() => {
        const fetchUserData = async () => {
            const userId = localStorage.getItem('userId');
            if (!userId || userId === 'null') {
                navigate('/login');
                return;
            }

            try {
                setLoading(true);
                const response = await apiClient.get(`/auth/users/${userId}`);
                setProfile({
                    username: response.data.username || '',
                    email: response.data.email || '',
                    phoneNumber: response.data.phoneNumber || 'Not Provided',
                    role: response.data.role || 'CUSTOMER'
                });
            } catch (err) {
                console.error("Profile Fetch Error:", err);
                setSnackbar({ open: true, message: "Could not sync with Auth server", severity: "error" });
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, [navigate]);

    // Update Personal Details
    const handleUpdate = async () => {
        const userId = localStorage.getItem('userId');
        setUpdating(true);
        try {
            await apiClient.put(`/auth/users/${userId}`, profile);
            setSnackbar({ open: true, message: "Personal details updated!", severity: "success" });
            setIsEditMode(false);
        } catch (err) {
            setSnackbar({ open: true, message: "Update failed.", severity: "error" });
        } finally {
            setUpdating(false);
        }
    };

    // Password Reset Logic
    const handlePasswordReset = async () => {
        if (passwords.new !== passwords.confirm) {
            setSnackbar({ open: true, message: "New passwords do not match!", severity: "warning" });
            return;
        }
        
        setUpdating(true);
        try {
            const userId = localStorage.getItem('userId');
            await apiClient.put(`/auth/users/${userId}`, { ...profile, password: passwords.new });
            
            Swal.fire({
                title: 'Security Updated',
                text: 'Your password has been changed successfully.',
                icon: 'success',
                borderRadius: '20px'
            });
            setPasswords({ current: '', new: '', confirm: '' });
        } catch (err) {
            setSnackbar({ open: true, message: "Password update failed.", severity: "error" });
        } finally {
            setUpdating(false);
        }
    };

    const handleDeleteAccount = async () => {
        const result = await Swal.fire({
            title: 'Permanent Deletion?',
            text: "This action cannot be undone. All your bookings will be lost.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes, Delete My Account',
            borderRadius: '20px'
        });

        if (result.isConfirmed) {
            const userId = localStorage.getItem('userId');
            try {
                await apiClient.delete(`/auth/users/${userId}`);
                authService.logoutUser();
                navigate('/login');
            } catch (err) {
                setSnackbar({ open: true, message: "Deletion failed", severity: "error" });
            }
        }
    };

    if (loading) return (
        <Container maxWidth="md" sx={{ pt: 15 }}>
            <Skeleton variant="circular" width={100} height={100} sx={{ mb: 4 }} />
            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: '40px' }} />
        </Container>
    );

    return (
        <Container maxWidth="md" sx={{ pt: 15, pb: 10 }}>
            {/* Top Header Card */}
            <Paper elevation={0} sx={{ 
                borderRadius: '40px', p: 5, mb: 4, 
                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', 
                color: 'white', position: 'relative', overflow: 'hidden'
            }}>
                <Box sx={{ position: 'absolute', top: -20, right: -20, width: 150, height: 150, borderRadius: '50%', bgcolor: 'rgba(59, 130, 246, 0.1)' }} />
                
                <Stack direction={{ xs: 'column', md: 'row' }} alignItems="center" spacing={4} sx={{ position: 'relative', zIndex: 1 }}>
                    <Box sx={{ position: 'relative' }}>
                        <Avatar src={`https://ui-avatars.com/api/?name=${profile.username}&background=3b82f6&color=fff&size=200`} sx={{ width: 120, height: 120, border: '4px solid rgba(255,255,255,0.1)' }} />
                        <IconButton size="small" sx={{ position: 'absolute', bottom: 0, right: 0, bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}>
                            <PhotoCameraIcon fontSize="small" />
                        </IconButton>
                    </Box>
                    <Box textAlign={{ xs: 'center', md: 'left' }}>
                        <Typography variant="h3" fontWeight={1000} sx={{ letterSpacing: -1.5 }}>{profile.username}</Typography>
                        <Chip label={profile.role} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: '#3b82f6', fontWeight: 900, mt: 1 }} />
                        <Typography variant="body2" sx={{ opacity: 0.7, mt: 1 }}>Client ID: #DE-USER-{localStorage.getItem('userId')}</Typography>
                    </Box>
                </Stack>
            </Paper>

            <Grid container spacing={4}>
                {/* 1. PERSONAL DETAILS SECTION */}
                <Grid item xs={12} md={7}>
                    <Paper elevation={0} sx={{ borderRadius: '35px', p: 4, border: '1px solid #e2e8f0' }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
                            <Typography variant="h6" fontWeight={900}>Personal Details</Typography>
                            <IconButton onClick={() => setIsEditMode(!isEditMode)} color={isEditMode ? "primary" : "default"}>
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </Stack>
                        
                        <Stack spacing={3}>
                            <TextField fullWidth label="Username" disabled={!isEditMode} value={profile.username} onChange={(e) => setProfile({...profile, username: e.target.value})} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '15px' } }} />
                            <TextField fullWidth label="Email Address" disabled={!isEditMode} value={profile.email} onChange={(e) => setProfile({...profile, email: e.target.value})} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '15px' } }} />
                            <TextField fullWidth label="Phone Number" disabled={!isEditMode} value={profile.phoneNumber} onChange={(e) => setProfile({...profile, phoneNumber: e.target.value})} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '15px' } }} />
                            
                            {isEditMode && (
                                <Button variant="contained" startIcon={updating ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />} onClick={handleUpdate} sx={{ borderRadius: '15px', py: 1.5, fontWeight: 800 }}>Save Changes</Button>
                            )}
                        </Stack>
                    </Paper>
                </Grid>

                {/* 2. SECURITY & PASSWORD SECTION */}
                <Grid item xs={12} md={5}>
                    <Paper elevation={0} sx={{ borderRadius: '35px', p: 4, border: '1px solid #e2e8f0', bgcolor: '#f8fafc' }}>
                        <Stack direction="row" alignItems="center" spacing={1} mb={4}>
                            <LockIcon color="primary" fontSize="small" />
                            <Typography variant="h6" fontWeight={900}>Security</Typography>
                        </Stack>

                        <Stack spacing={2.5}>
                            <TextField 
                                fullWidth type={showPassword ? "text" : "password"} label="New Password" 
                                value={passwords.new} onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPassword(!showPassword)} size="small">
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                    sx: { borderRadius: '15px', bgcolor: 'white' }
                                }}
                            />
                            <TextField 
                                fullWidth type="password" label="Confirm Password" 
                                value={passwords.confirm} onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '15px', bgcolor: 'white' } }} 
                            />
                            <Button variant="outlined" fullWidth onClick={handlePasswordReset} disabled={!passwords.new} sx={{ borderRadius: '15px', py: 1.2, fontWeight: 800 }}>Update Password</Button>
                        </Stack>

                        <Divider sx={{ my: 4 }} />
                        
                        <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ display: 'block', mb: 2 }}>DANGER ZONE</Typography>
                        <Button fullWidth color="error" startIcon={<DeleteForeverIcon />} onClick={handleDeleteAccount} sx={{ fontWeight: 800, textTransform: 'none' }}>Close Account Permanently</Button>
                    </Paper>
                </Grid>
            </Grid>

            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: '15px', fontWeight: 700 }}>{snackbar.message}</Alert>
            </Snackbar>
        </Container>
    );
};

export default CustomerProfile;