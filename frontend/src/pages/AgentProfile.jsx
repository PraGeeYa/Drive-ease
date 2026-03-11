import React, { useState, useEffect } from 'react';
import {
    Box, Grid, Typography, Paper, TextField, Button, Avatar, 
    Stack, IconButton, Divider, Snackbar, Alert, Dialog, 
    DialogTitle, DialogContent, DialogContentText, DialogActions, InputAdornment, CircularProgress
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import { authService } from '../api/authService';

// Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DateRangeIcon from '@mui/icons-material/DateRange';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import SecurityIcon from '@mui/icons-material/Security';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BadgeIcon from '@mui/icons-material/Badge';
import PersonIcon from '@mui/icons-material/Person';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const AgentProfile = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');

    // States
    const [loading, setLoading] = useState(true);
    const [profileData, setProfileData] = useState({
        fullName: '',
        email: '',
        phone: '', 
        employeeId: '',
        role: ''
    });

    // 🔥 Updated Password State to include current password
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [isEditMode, setIsEditMode] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    // FETCH REAL DATA FROM AUTH CONTROLLER
    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await apiClient.get(`/auth/users/${userId}`);
                const user = response.data;
                setProfileData({
                    fullName: user.username || '',
                    email: user.email || '',
                    phone: user.phoneNumber || 'Not Provided', 
                    employeeId: user.userId || user.id || userId,
                    role: user.role || 'AGENT'
                });
            } catch (error) {
                console.error("Error fetching profile:", error);
                setSnackbar({ open: true, message: "Failed to load profile data", severity: "error" });
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchProfileData();
        } else {
            navigate('/login');
        }
    }, [userId, navigate]);

    // UPDATE PROFILE DATA
    const handleUpdateProfile = async () => {
        try {
            const payload = {
                username: profileData.fullName,
                email: profileData.email
            };
            
            await apiClient.put(`/auth/users/${userId}`, payload);
            setSnackbar({ open: true, message: "Profile Details Updated Successfully!", severity: "success" });
            setIsEditMode(false);
        } catch (error) {
            setSnackbar({ open: true, message: "Update failed. Username or Email might be taken.", severity: "error" });
        }
    };

    // 🔥 UPDATE PASSWORD
    const handlePasswordChange = async () => {
        // Validation Checks
        if (!passwords.current) {
            setSnackbar({ open: true, message: "Please enter your current password!", severity: "warning" });
            return;
        }
        if (!passwords.new) {
            setSnackbar({ open: true, message: "Please enter a new password!", severity: "warning" });
            return;
        }
        if (passwords.new !== passwords.confirm) {
            setSnackbar({ open: true, message: "New passwords do not match!", severity: "error" });
            return;
        }

        try {
            const payload = {
                username: profileData.fullName,
                email: profileData.email,
                currentPassword: passwords.current, // Send current password to backend if needed for verification
                password: passwords.new // Send the new password
            };

            await apiClient.put(`/auth/users/${userId}`, payload);
            setSnackbar({ open: true, message: "Password Updated Successfully!", severity: "success" });
            setPasswords({ current: '', new: '', confirm: '' }); // Reset fields
        } catch (error) {
            setSnackbar({ open: true, message: "Failed to change password. Verify your current password.", severity: "error" });
        }
    };

    // DELETE ACCOUNT
    const handleDeleteAccount = async () => {
        try {
            await apiClient.delete(`/auth/users/${userId}`);
            setOpenDeleteDialog(false);
            authService.logoutUser();
            navigate('/login');
        } catch (error) {
            setSnackbar({ open: true, message: "Failed to delete account.", severity: "error" });
        }
    };

    const handleLogout = () => {
        authService.logoutUser();
        navigate('/login');
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: '#f4f7fa' }}>
                <CircularProgress size={60} />
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', bgcolor: '#f4f7fa', minHeight: '100vh', pt: 12 }}>
            
            {/* SIDEBAR */}
            <Paper elevation={0} sx={{ 
                width: 80, height: '100vh', position: 'fixed', left: 0, top: 0,
                display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4, 
                borderRadius: 0, borderRight: '1px solid #e2e8f0', bgcolor: '#fff', zIndex: 1201
            }}>
                <DirectionsCarIcon sx={{ color: theme.palette.primary.main, fontSize: 32, mb: 6 }} />
                <Stack spacing={3}>
                    <IconButton sx={{ color: '#94a3b8' }} onClick={() => navigate('/agent-dashboard')}><DashboardIcon /></IconButton>
                    <IconButton sx={{ color: '#94a3b8' }} onClick={() => navigate('/fleet-management')}><DirectionsCarIcon /></IconButton>
                    <IconButton sx={{ color: '#94a3b8' }} onClick={() => navigate('/booking-history')}><DateRangeIcon /></IconButton>
                    <IconButton sx={{ color: '#94a3b8' }} onClick={() => navigate('/favorites')}><FavoriteBorderIcon /></IconButton>
                </Stack>
                <Box sx={{ mt: 'auto' }}>
                    <IconButton color="primary" sx={{ bgcolor: `${theme.palette.primary.main}15` }} onClick={() => navigate('/settings')}><SettingsIcon /></IconButton>
                    <IconButton sx={{ color: '#ef4444' }} onClick={handleLogout}><LogoutIcon /></IconButton>
                </Box>
            </Paper>

            {/* MAIN CONTENT AREA */}
            <Box sx={{ flexGrow: 1, ml: '80px', p: { xs: 2, md: 5 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 5 }}>
                    <Box>
                        <Typography variant="h3" sx={{ fontWeight: 1000, color: '#1e293b' }}>
                            Account <span style={{ color: theme.palette.primary.main }}>Settings</span>
                        </Typography>
                        <Typography variant="body1" color="text.secondary">Manage your profile, security, and preferences</Typography>
                    </Box>
                    <Button 
                        variant={isEditMode ? "outlined" : "contained"} 
                        startIcon={<EditIcon />} 
                        onClick={() => setIsEditMode(!isEditMode)}
                        sx={{ borderRadius: '12px', px: 3, fontWeight: 800 }}
                    >
                        {isEditMode ? 'Cancel Editing' : 'Edit Profile'}
                    </Button>
                </Box>

                <Grid container spacing={4}>
                    {/* LEFT COLUMN: Profile Identity Card */}
                    <Grid item xs={12} md={4}>
                        <Paper sx={{ borderRadius: '28px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 20px 40px rgba(0,0,0,0.04)', width: '200%', mx: '150%' }}>
                            <Box sx={{ height: 140, background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)` }} />
                            <Box sx={{ px: 4, pb: 4, textAlign: 'center' }}>
                                <Box sx={{ position: 'relative', display: 'inline-block', mt: -7, mb: 2 }}>
                                    <Avatar 
                                        src={`https://ui-avatars.com/api/?name=${profileData.fullName}&background=fff&color=0014cc&size=150`} 
                                        sx={{ width: 130, height: 130, border: '6px solid #fff', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }} 
                                    />
                                </Box>
                                <Typography variant="h5" fontWeight={900} color="#1e293b">{profileData.fullName}</Typography>
                                <Typography variant="subtitle2" color="primary" fontWeight={800} sx={{ mb: 2, letterSpacing: 1 }}>{profileData.role}</Typography>
                                
                                <Grid container spacing={2} sx={{ mt: 1, mb: 3 }}>
                                    <Grid item xs={6}>
                                        <Paper elevation={0} sx={{ py: 1.5, bgcolor: '#f8fafc', borderRadius: '16px' }}>
                                            <Typography variant="h6" fontWeight={900} color="primary">Active</Typography>
                                            <Typography variant="caption" fontWeight={700} color="text.secondary">Status</Typography>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Paper elevation={0} sx={{ py: 1.5, bgcolor: '#f8fafc', borderRadius: '16px' }}>
                                            <Typography variant="h6" fontWeight={900} color="secondary.main">Top</Typography>
                                            <Typography variant="caption" fontWeight={700} color="text.secondary">Tier</Typography>
                                        </Paper>
                                    </Grid>
                                </Grid>
                                
                                <Divider sx={{ mb: 3, borderStyle: 'dashed' }} />
                                
                                <Stack spacing={2} textAlign="left">
                                    <Box display="flex" alignItems="center">
                                        <BadgeIcon sx={{ color: '#94a3b8', mr: 2, fontSize: 20 }} />
                                        <Box>
                                            <Typography variant="caption" color="text.secondary" fontWeight={700}>SYSTEM ID</Typography>
                                            <Typography variant="body2" fontWeight={800}>{profileData.employeeId}</Typography>
                                        </Box>
                                    </Box>
                                    <Box display="flex" alignItems="center">
                                        <SecurityIcon sx={{ color: '#10b981', mr: 2, fontSize: 20 }} />
                                        <Box>
                                            <Typography variant="caption" color="text.secondary" fontWeight={700}>VERIFICATION</Typography>
                                            <Typography variant="body2" fontWeight={800} color="#10b981">Verified & Secured</Typography>
                                        </Box>
                                    </Box>
                                </Stack>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* RIGHT COLUMN: Edit Forms & Danger Zone */}
                    <Grid item xs={12} md={8}>
                        <Stack spacing={4}>
                            {/* Personal Info Paper */}
                            <Paper sx={{ p: 4, borderRadius: '28px', border: '1px solid #e2e8f0', boxShadow: '0 20px 40px rgba(0,0,0,0.02)' }}>
                                <Typography variant="h6" fontWeight={800} mb={3}>Personal Information</Typography>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField 
                                            fullWidth label="Username / Full Name" value={profileData.fullName} 
                                            disabled={!isEditMode}
                                            onChange={(e) => setProfileData({...profileData, fullName: e.target.value})} 
                                            InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon color={isEditMode ? "primary" : "inherit"}/></InputAdornment> }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField 
                                            fullWidth label="Email Address" type="email" value={profileData.email} 
                                            disabled={!isEditMode}
                                            onChange={(e) => setProfileData({...profileData, email: e.target.value})} 
                                            InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon color={isEditMode ? "primary" : "inherit"}/></InputAdornment> }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField 
                                            fullWidth label="Phone Number" value={profileData.phone} 
                                            disabled={!isEditMode}
                                            onChange={(e) => setProfileData({...profileData, phone: e.target.value})} 
                                            InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIcon color={isEditMode ? "primary" : "inherit"}/></InputAdornment> }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField fullWidth label="System Role" value={profileData.role} disabled />
                                    </Grid>
                                </Grid>
                                
                                {isEditMode && (
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                                        <Button variant="contained" onClick={handleUpdateProfile} sx={{ borderRadius: '12px', px: 5, py: 1.5, fontWeight: 800 }}>Save Changes</Button>
                                    </Box>
                                )}
                            </Paper>

                            {/* 🔥 Security Paper Updated with Current Password */}
                            <Paper sx={{ p: 4, borderRadius: '28px', border: '1px solid #e2e8f0', boxShadow: '0 20px 40px rgba(0,0,0,0.02)' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                    <SecurityIcon color="primary" sx={{ mr: 1.5 }} />
                                    <Typography variant="h6" fontWeight={800}>Update Password</Typography>
                                </Box>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <TextField 
                                            fullWidth 
                                            type="password" 
                                            label="Current Password" 
                                            value={passwords.current} 
                                            onChange={(e) => setPasswords({...passwords, current: e.target.value})} 
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField 
                                            fullWidth 
                                            type="password" 
                                            label="New Password" 
                                            value={passwords.new} 
                                            onChange={(e) => setPasswords({...passwords, new: e.target.value})} 
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField 
                                            fullWidth 
                                            type="password" 
                                            label="Confirm New Password" 
                                            value={passwords.confirm} 
                                            onChange={(e) => setPasswords({...passwords, confirm: e.target.value})} 
                                        />
                                    </Grid>
                                </Grid>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                                    <Button variant="outlined" onClick={handlePasswordChange} sx={{ borderRadius: '12px', px: 4, py: 1.5, fontWeight: 800, borderWidth: '2px' }}>Update Password</Button>
                                </Box>
                            </Paper>

                            {/* Danger Zone */}
                            <Paper sx={{ p: 4, borderRadius: '28px', border: '1px solid #fca5a5', bgcolor: '#fef2f2' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <WarningAmberIcon color="error" sx={{ mr: 1.5, fontSize: 28 }} />
                                    <Typography variant="h6" fontWeight={800} color="error.main">Danger Zone</Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                    Once you delete your account, there is no going back. All your assigned fleet and booking records will be reassigned or permanently deleted. Please be certain.
                                </Typography>
                                <Button 
                                    variant="contained" 
                                    color="error" 
                                    startIcon={<DeleteForeverIcon />} 
                                    onClick={() => setOpenDeleteDialog(true)}
                                    sx={{ borderRadius: '12px', px: 4, py: 1.5, fontWeight: 800, boxShadow: '0 10px 20px rgba(239,68,68,0.3)' }}
                                >
                                    Delete My Account
                                </Button>
                            </Paper>
                        </Stack>
                    </Grid>
                </Grid>
            </Box>

            {/* Delete Confirmation Dialog */}
            <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} PaperProps={{ sx: { borderRadius: '24px', p: 2, maxWidth: '400px' } }}>
                <DialogTitle sx={{ fontWeight: 900, color: '#ef4444', display: 'flex', alignItems: 'center' }}>
                    <WarningAmberIcon sx={{ mr: 1 }} /> Confirm Deletion
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ fontWeight: 600, color: '#475569' }}>
                        Are you completely sure you want to delete your Agent Account? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpenDeleteDialog(false)} sx={{ fontWeight: 800, color: '#64748b' }}>Cancel</Button>
                    <Button onClick={handleDeleteAccount} variant="contained" color="error" sx={{ borderRadius: '10px', fontWeight: 800 }}>Yes, Delete</Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                <Alert severity={snackbar.severity} sx={{ borderRadius: '12px', fontWeight: 700 }}>{snackbar.message}</Alert>
            </Snackbar>
        </Box>
    );
};

export default AgentProfile;