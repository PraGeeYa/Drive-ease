import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
    Box, Grid, Paper, Typography, Stack, Container, Tab, Tabs,
    Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    IconButton, Chip, Avatar, Dialog, DialogTitle, DialogContent, TextField, MenuItem,
    Snackbar, Alert, Switch, Divider, InputAdornment
} from '@mui/material';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
    ResponsiveContainer
} from 'recharts';

// Icons
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import PeopleIcon from '@mui/icons-material/People';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import BusinessIcon from '@mui/icons-material/Business';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import RefreshIcon from '@mui/icons-material/Refresh';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SecurityIcon from '@mui/icons-material/Security';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import StorageIcon from '@mui/icons-material/Storage';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';

import apiClient from '../api/axiosConfig';

const AdminDashboard = () => {
    const [tabValue, setTabValue] = useState(0);
    const [users, setUsers] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [providers, setProviders] = useState([]); 
    const [messages, setMessages] = useState([]); 
    const [loading, setLoading] = useState(false);
    
    const adminId = localStorage.getItem('userId');

    // Modals & Snackbar States
    const [openVehicleModal, setOpenVehicleModal] = useState(false);
    const [openEditVehicleModal, setOpenEditVehicleModal] = useState(false);
    const [openProviderModal, setOpenProviderModal] = useState(false);
    const [openEditProviderModal, setOpenEditProviderModal] = useState(false);
    const [openEditUserModal, setOpenEditUserModal] = useState(false); 
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Profile States
    const [profileData, setProfileData] = useState({ fullName: '', email: '', role: 'ADMIN', employeeId: '' });
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
    const [isProfileEdit, setIsProfileEdit] = useState(false);

    // Forms State
    const [newVehicle, setNewVehicle] = useState({ 
        vehicleType: '', providerId: '', finalPrice: '', allowedMileage: '', imageUrl: '' 
    });
    const [editVehicle, setEditVehicle] = useState({
        id: '', vehicleType: '', providerId: '', finalPrice: '', allowedMileage: '', imageUrl: '' 
    });
    const [newProvider, setNewProvider] = useState({ providerName: '', phoneNo: '', email: '' });
    const [editProvider, setEditProvider] = useState({ id: '', providerName: '', phoneNo: '', email: '' });
    const [editUser, setEditUser] = useState({ id: '', username: '', email: '', role: '' });

    const revenueStats = [
        { name: 'Mon', income: 45000 }, { name: 'Tue', income: 52000 },
        { name: 'Wed', income: 48000 }, { name: 'Thu', income: 61000 },
        { name: 'Fri', income: 55000 }, { name: 'Sat', income: 67000 },
        { name: 'Sun', income: 72000 },
    ];

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#7c3aed', '#ef4444', '#ec4899'];

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            // 🔥 FIXED: Removed the incorrect "apiRes:" key from Promise.all array
            const [userRes, vehicleRes, providerRes, profileRes, messageRes] = await Promise.all([
                apiClient.get('/auth/users'),
                apiClient.get('/admin/vehicles'), 
                apiClient.get('/admin/providers'),
                apiClient.get(`/auth/users/${adminId}`),
                apiClient.get('/contact/all') 
            ]);

            setUsers(userRes.data || []);
            setVehicles(vehicleRes.data || []);
            setProviders(providerRes.data || []);
            setMessages(messageRes.data || []); 
            
            if (profileRes.data) {
                setProfileData({
                    fullName: profileRes.data.username || '',
                    email: profileRes.data.email || '',
                    role: profileRes.data.role || 'ADMIN',
                    employeeId: profileRes.data.userId || adminId
                });
            }
        } catch (err) {
            console.error("Fetch error:", err);
            setSnackbar({ open: true, message: "Real-time sync failed", severity: "error" });
        } finally {
            setLoading(false);
        }
    }, [adminId]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleUpdateAdminProfile = async () => {
        try {
            await apiClient.put(`/auth/users/${adminId}`, { username: profileData.fullName, email: profileData.email });
            setSnackbar({ open: true, message: "Admin Profile Updated!", severity: "success" });
            setIsProfileEdit(false);
            fetchData();
        } catch (err) { setSnackbar({ open: true, message: "Update failed", severity: "error" }); }
    };

    const handleAdminPasswordChange = async () => {
        if (passwords.new !== passwords.confirm) {
            setSnackbar({ open: true, message: "Passwords do not match!", severity: "error" });
            return;
        }
        try {
            await apiClient.put(`/auth/users/${adminId}`, { username: profileData.fullName, email: profileData.email, password: passwords.new });
            setSnackbar({ open: true, message: "Password Updated Successfully!", severity: "success" });
            setPasswords({ current: '', new: '', confirm: '' });
        } catch (err) { setSnackbar({ open: true, message: "Failed to update password", severity: "error" }); }
    };

    const handleToggleStatus = async (contractId, currentAvailability) => {
        const nextStatusStr = currentAvailability ? "RENTED" : "AVAILABLE";
        try {
            await apiClient.patch(`/admin/vehicles/${contractId}/status`, { status: nextStatusStr });
            setSnackbar({ open: true, message: `Status updated`, severity: 'info' });
            fetchData();
        } catch (err) { setSnackbar({ open: true, message: "Update failed", severity: "error" }); }
    };

    const handleDelete = async (path, id) => {
        if (window.confirm("Confirm deletion? This will remove all related records.")) {
            try {
                await apiClient.delete(`${path}/${id}`);
                setSnackbar({ open: true, message: "Deleted successfully", severity: "success" });
                fetchData();
            } catch (err) { 
                setSnackbar({ open: true, message: "Constraint Error: Record is active elsewhere.", severity: "error" }); 
            }
        }
    };

    const handleUpdateUserRole = async (userId, newRole) => {
        try {
            await apiClient.patch(`/admin/users/${userId}/role`, { role: newRole });
            setSnackbar({ open: true, message: `Role set to ${newRole}`, severity: 'success' });
            fetchData();
        } catch (err) { setSnackbar({ open: true, message: "Failed to update role", severity: "error" }); }
    };

    const openEditVehicle = (v) => {
        setEditVehicle({
            id: v.contractId || v.id,
            vehicleType: v.vehicleType,
            providerId: v.provider?.providerId || '',
            finalPrice: v.baseRatePerDay,
            allowedMileage: v.allowedMileage,
            imageUrl: v.imageUrl
        });
        setOpenEditVehicleModal(true);
    };

    const handleUpdateVehicle = async () => {
        try {
            const payload = {
                vehicleType: editVehicle.vehicleType,
                providerId: editVehicle.providerId,
                baseRatePerDay: Number(editVehicle.finalPrice),
                allowedMileage: Number(editVehicle.allowedMileage),
                imageUrl: editVehicle.imageUrl,
                availabilityStatus: true
            };
            await apiClient.put(`/admin/vehicles/${editVehicle.id}`, payload);
            setSnackbar({ open: true, message: "Vehicle updated!", severity: "success" });
            setOpenEditVehicleModal(false);
            fetchData();
        } catch (err) { setSnackbar({ open: true, message: "Update failed!", severity: "error" }); }
    };

    const openEditProvider = (provider) => {
        setEditProvider({ 
            id: provider.providerId || provider.provider_id, 
            providerName: provider.providerName || provider.provider_name, 
            phoneNo: provider.phoneNo || provider.contactDetails, 
            email: provider.email 
        });
        setOpenEditProviderModal(true);
    };

    const handleUpdateProvider = async () => {
        try {
            await apiClient.put(`/admin/providers/${editProvider.id}`, { providerName: editProvider.providerName, contactDetails: editProvider.phoneNo, email: editProvider.email });
            setSnackbar({ open: true, message: "Provider updated!", severity: "success" });
            setOpenEditProviderModal(false);
            fetchData();
        } catch (err) { setSnackbar({ open: true, message: "Error updating provider", severity: "error" }); }
    };

    const openEditUser = (user) => {
        setEditUser({ id: user.userId, username: user.username, email: user.email || '', role: user.role });
        setOpenEditUserModal(true);
    };

    const handleUpdateUser = async () => {
        try {
            await apiClient.put(`/auth/users/${editUser.id}`, { username: editUser.username, email: editUser.email });
            setSnackbar({ open: true, message: "User updated!", severity: "success" });
            setOpenEditUserModal(false);
            fetchData();
        } catch (err) { setSnackbar({ open: true, message: "Error updating user", severity: "error" }); }
    };

    const handleAddVehicle = async () => {
        try {
            const vehiclePayload = {
                vehicleType: newVehicle.vehicleType, providerId: newVehicle.providerId, 
                baseRatePerDay: Number(newVehicle.finalPrice), allowedMileage: Number(newVehicle.allowedMileage), 
                availabilityStatus: true, imageUrl: newVehicle.imageUrl
            };
            await apiClient.post('/admin/vehicles', vehiclePayload);
            setSnackbar({ open: true, message: "Vehicle added!", severity: "success" });
            setOpenVehicleModal(false);
            setNewVehicle({ vehicleType: '', providerId: '', finalPrice: '', allowedMileage: '', imageUrl: '' });
            fetchData();
        } catch (err) { setSnackbar({ open: true, message: "Entry failed!", severity: "error" }); }
    };

    const handleAddProvider = async () => {
        try {
            await apiClient.post('/admin/providers', {
                providerName: newProvider.providerName,
                contactDetails: newProvider.phoneNo,
                email: newProvider.email
            });
            setSnackbar({ open: true, message: "Provider added!", severity: "success" });
            setOpenProviderModal(false);
            setNewProvider({ providerName: '', phoneNo: '', email: '' });
            fetchData();
        } catch (err) { setSnackbar({ open: true, message: "Error adding provider", severity: "error" }); }
    };

    return (
        <Box sx={{ display: 'flex', flexGrow: 1, bgcolor: '#f4f7fe', minHeight: '100vh' }}>
            
            {/* SIDEBAR NAVIGATION */}
            <Paper elevation={0} sx={{ 
                width: 280, borderRadius: 0, p: 3, borderRight: '1px solid #e2e8f0', 
                display: { xs: 'none', lg: 'flex' }, flexDirection: 'column', 
                bgcolor: '#fff', flexShrink: 0, position: 'sticky', top: 0, height: '100vh'
            }}>
                <Box sx={{ mb: 4, px: 2 }}>
                   <Typography variant="h5" fontWeight={1000} color="primary">DRIVE<span style={{color:'#1b2559'}}>EASE</span></Typography>
                   <Typography variant="caption" fontWeight={700} color="text.secondary">ENTERPRISE ADMIN</Typography>
                </Box>
                <Stack spacing={1} sx={{ flexGrow: 1 }}>
                    {[
                        { label: 'Intelligence Overview', icon: <AssessmentIcon />, val: 0 },
                        { label: 'Users & Staff Control', icon: <PeopleIcon />, val: 1 },
                        { label: 'Live Fleet Inventory', icon: <DirectionsCarIcon />, val: 2 },
                        { label: 'Supplier Hub', icon: <BusinessIcon />, val: 3 },
                        { label: 'Account Settings', icon: <AdminPanelSettingsIcon />, val: 4 },
                    ].map((item) => (
                        <Button key={item.val} fullWidth startIcon={item.icon} onClick={() => setTabValue(item.val)} 
                            sx={{ justifyContent: 'flex-start', py: 1.8, px: 3, borderRadius: '15px', fontWeight: 800, bgcolor: tabValue === item.val ? '#3b82f615' : 'transparent', color: tabValue === item.val ? 'primary.main' : '#64748b', textTransform: 'none' }}>
                            {item.label}
                        </Button>
                    ))}
                </Stack>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar src={`https://ui-avatars.com/api/?name=${profileData.fullName}&background=3b82f6&color=fff`} sx={{ width: 45, height: 45 }} />
                    <Box sx={{ overflow: 'hidden' }}>
                        <Typography variant="body2" fontWeight={800} noWrap>{profileData.fullName}</Typography>
                        <Typography variant="caption" color="text.secondary" fontWeight={700}>System Admin</Typography>
                    </Box>
                </Box>
            </Paper>

            {/* MAIN CONTENT AREA */}
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', width: '100%', overflowX: 'hidden' }}>
                <Container maxWidth="xl" sx={{ p: { xs: 3, md: 5 }, flexGrow: 1 }}>
                    
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={5} flexWrap="wrap">
                        <Box>
                            <Typography variant="h3" fontWeight={1000} sx={{ letterSpacing: -2, color: '#1b2559' }}>
                                {tabValue === 4 ? 'Admin Profile' : 'Enterprise Intel'}
                            </Typography>
                        </Box>
                        <IconButton onClick={fetchData} sx={{ bgcolor: '#fff', border: '1px solid #e2e8f0', width: 50, height: 50 }}><RefreshIcon /></IconButton>
                    </Stack>

                    {/* KPI CARDS */}
                    {tabValue < 4 && (
                        <Grid container spacing={3} mb={5}>
                            {[
                                { label: 'Gross Revenue', value: 'LKR 842k', icon: <TrendingUpIcon />, color: '#3b82f6' },
                                { label: 'Total Clients', value: users.length, icon: <PeopleIcon />, color: '#10b981' },
                                { label: 'Live Fleet', value: vehicles.length, icon: <DirectionsCarIcon />, color: '#f59e0b' },
                                { label: 'Partners', value: providers.length, icon: <BusinessIcon />, color: '#7c3aed' },
                            ].map((s, i) => (
                                <Grid item xs={12} sm={6} lg={3} key={i}>
                                    <Paper elevation={0} sx={{ p: 3, borderRadius: '24px', bgcolor: '#fff', display: 'flex', alignItems: 'center', gap: 2.5, boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                                        <Avatar sx={{ bgcolor: `${s.color}15`, color: s.color, width: 64, height: 64, borderRadius: '18px' }}>{s.icon}</Avatar>
                                        <Box><Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ textTransform: 'uppercase' }}>{s.label}</Typography><Typography variant="h4" fontWeight={1000} sx={{ color: '#1b2559' }}>{s.value}</Typography></Box>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    )}

                    {/* OVERVIEW TAB */}
                    {tabValue === 0 && (
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Paper sx={{ p: 4, borderRadius: '35px', bgcolor: '#ffffff00', boxShadow: '0 0px 0px rgba(0,0,0,0.03)' }}>
                                    <Typography variant="h5" fontWeight={900} color="#1b2559" mb={3}>Income Performance (Weekly)</Typography>
                                    <Box sx={{ width: '250%', height: 350 }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={revenueStats}>
                                                <defs><linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient></defs>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 700}} />
                                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 700}} />
                                                <Tooltip contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
                                                <Area type="monotone" dataKey="income" stroke="#3b82f6" strokeWidth={5} fill="url(#colorIncome)" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </Box>
                                </Paper>
                            </Grid>
                            
                            {/* Support Messages Section */}
                            <Grid item xs={12}>
                                <Paper sx={{ p: 4, borderRadius: '35px', bgcolor: '#fff', boxShadow: '0 4px 25px rgba(0,0,0,0.03)', width: '150%' }}>
                                    <Stack direction="row" spacing={2} alignItems="center" mb={4}>
                                        <MarkEmailUnreadIcon color="primary" />
                                        <Typography variant="h5" fontWeight={900} color="#1b2559">Support Inbox</Typography>
                                    </Stack>
                                    <TableContainer>
                                        <Table>
                                            <TableHead><TableRow><TableCell sx={{ fontWeight: 800 }}>SENDER</TableCell><TableCell sx={{ fontWeight: 800 }}>EMAIL</TableCell><TableCell sx={{ fontWeight: 800 }}>SUBJECT</TableCell><TableCell align="right" sx={{ fontWeight: 800 }}>ACTION</TableCell></TableRow></TableHead>
                                            <TableBody>
                                                {messages.slice(-5).reverse().map((msg) => (
                                                    <TableRow key={msg.id}>
                                                        <TableCell sx={{ fontWeight: 700 }}>{msg.firstName} {msg.lastName}</TableCell>
                                                        <TableCell>{msg.email}</TableCell>
                                                        <TableCell><Chip label={msg.subject || 'General'} size="small" variant="outlined" /></TableCell>
                                                        <TableCell align="right"><IconButton color="error" onClick={() => handleDelete('/contact', msg.id)}><DeleteIcon /></IconButton></TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Paper>
                            </Grid>
                        </Grid>
                    )}

                    {/* USERS TAB */}
                    {tabValue === 1 && (
                        <TableContainer component={Paper} sx={{ borderRadius: '25px' }}>
                            <Table>
                                <TableHead sx={{ bgcolor: '#f9f9ff' }}><TableRow><TableCell sx={{ fontWeight: 800 }}>USER NAME</TableCell><TableCell sx={{ fontWeight: 800 }}>EMAIL</TableCell><TableCell sx={{ fontWeight: 800 }}>SYSTEM ROLE</TableCell><TableCell align="right" sx={{ fontWeight: 800 }}>ACTIONS</TableCell></TableRow></TableHead>
                                <TableBody>{users.map((u) => (
                                    <TableRow key={u.userId} hover>
                                        <TableCell><Stack direction="row" spacing={2} alignItems="center"><Avatar sx={{ bgcolor: '#3b82f6', fontWeight: 800 }}>{u.username?.[0]}</Avatar><Typography fontWeight={800}>{u.username}</Typography></Stack></TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>{u.email || 'N/A'}</TableCell>
                                        <TableCell>
                                            <TextField select value={u.role || 'CUSTOMER'} onChange={(e) => handleUpdateUserRole(u.userId, e.target.value)} size="small" variant="outlined" sx={{ minWidth: 150, '& .MuiOutlinedInput-root': { borderRadius: '12px', fontWeight: 800 } }}>
                                                <MenuItem value="ADMIN">ADMIN</MenuItem>
                                                <MenuItem value="AGENT">AGENT</MenuItem>
                                                <MenuItem value="CUSTOMER">CUSTOMER</MenuItem>
                                            </TextField>
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton color="primary" onClick={() => openEditUser(u)}><EditIcon /></IconButton>
                                            <IconButton color="error" onClick={() => handleDelete('/auth/users', u.userId)}><DeleteIcon /></IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}</TableBody>
                            </Table>
                        </TableContainer>
                    )}

                    {/* FLEET TAB */}
                    {tabValue === 2 && (
                        <>
                        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenVehicleModal(true)} sx={{ mb: 4, borderRadius: '15px', fontWeight: 800, py: 1.5, textTransform: 'none' }}>Add Vehicle</Button>
                        <TableContainer component={Paper} sx={{ borderRadius: '25px' }}>
                            <Table><TableHead sx={{ bgcolor: '#f9f9ff' }}><TableRow><TableCell sx={{ fontWeight: 800 }}>IMAGE</TableCell><TableCell sx={{ fontWeight: 800 }}>MODEL</TableCell><TableCell sx={{ fontWeight: 800 }}>LIVE STATUS</TableCell><TableCell sx={{ fontWeight: 800 }}>PRICE</TableCell><TableCell align="right" sx={{ fontWeight: 800 }}>ACTIONS</TableCell></TableRow></TableHead>
                                <TableBody>{vehicles.map((v) => (
                                    <TableRow key={v.contractId || v.id} hover>
                                        <TableCell><Box component="img" src={v.imageUrl || 'https://via.placeholder.com/90x60'} sx={{ width: 90, height: 60, borderRadius: '10px', objectFit: 'cover' }} /></TableCell>
                                        <TableCell sx={{ fontWeight: 800 }}>{v.vehicleType}</TableCell>
                                        <TableCell>
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                <Switch checked={v.availabilityStatus === false} onChange={() => handleToggleStatus(v.contractId || v.id, v.availabilityStatus)} color="secondary" />
                                                <Chip label={v.availabilityStatus === false ? 'RENTED' : 'AVAILABLE'} size="small" />
                                            </Stack>
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 800 }}>LKR {v.baseRatePerDay?.toLocaleString()}</TableCell>
                                        <TableCell align="right">
                                            <IconButton color="primary" onClick={() => openEditVehicle(v)}><EditIcon /></IconButton>
                                            <IconButton color="error" onClick={() => handleDelete('/admin/vehicles', v.contractId || v.id)}><DeleteIcon /></IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}</TableBody></Table>
                        </TableContainer>
                        </>
                    )}

                    {/* PROVIDERS TAB */}
                    {tabValue === 3 && (
                         <>
                         <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenProviderModal(true)} sx={{ mb: 4, borderRadius: '15px', fontWeight: 800, py: 1.5, textTransform: 'none' }}>Register Provider</Button>
                         <TableContainer component={Paper} sx={{ borderRadius: '25px' }}>
                             <Table><TableHead sx={{ bgcolor: '#f9f9ff' }}><TableRow><TableCell sx={{ fontWeight: 800 }}>PROVIDER NAME</TableCell><TableCell sx={{ fontWeight: 800 }}>CONTACT</TableCell><TableCell align="right" sx={{ fontWeight: 800 }}>ACTIONS</TableCell></TableRow></TableHead>
                                 <TableBody>{providers.map((p) => (
                                     <TableRow key={p.providerId} hover>
                                         <TableCell sx={{ fontWeight: 800 }}>{p.providerName}</TableCell>
                                         <TableCell>{p.phoneNo || p.contactDetails}</TableCell>
                                         <TableCell align="right">
                                             <IconButton color="primary" onClick={() => openEditProvider(p)}><EditIcon /></IconButton>
                                             <IconButton color="error" onClick={() => handleDelete('/admin/providers', p.providerId)}><DeleteIcon /></IconButton>
                                         </TableCell>
                                     </TableRow>
                                 ))}</TableBody>
                             </Table>
                         </TableContainer>
                         </>
                    )}

                    {/* PROFILE TAB */}
                    {tabValue === 4 && (
                        <Grid container spacing={4}>
                            <Grid item xs={12} md={4}>
                                <Paper sx={{ p: 4, borderRadius: '35px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.04)' }}>
                                    <Avatar src={`https://ui-avatars.com/api/?name=${profileData.fullName}&background=3b82f6&color=fff&size=150`} sx={{ width: 120, height: 120, mx: 'auto', mb: 3, border: '5px solid #f4f7fe' }} />
                                    <Typography variant="h5" fontWeight={1000}>{profileData.fullName}</Typography>
                                    <Typography variant="subtitle2" color="primary" fontWeight={800}>SYSTEM ADMINISTRATOR</Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={8}>
                                <Stack spacing={4}>
                                    <Paper sx={{ p: 4, borderRadius: '35px', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
                                        <Stack direction="row" justifyContent="space-between" mb={4}><Typography variant="h6" fontWeight={900}>Personal Details</Typography><Button variant={isProfileEdit ? "outlined" : "contained"} size="small" onClick={() => setIsProfileEdit(!isProfileEdit)} sx={{borderRadius: '10px'}}>{isProfileEdit ? 'Cancel' : 'Edit'}</Button></Stack>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} sm={6}><TextField fullWidth label="Username" value={profileData.fullName} disabled={!isProfileEdit} onChange={(e) => setProfileData({...profileData, fullName: e.target.value})} /></Grid>
                                            <Grid item xs={12} sm={6}><TextField fullWidth label="Email" value={profileData.email} disabled={!isProfileEdit} onChange={(e) => setProfileData({...profileData, email: e.target.value})} /></Grid>
                                        </Grid>
                                        {isProfileEdit && <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}><Button variant="contained" onClick={handleUpdateAdminProfile} sx={{borderRadius: '10px'}}>Save Profile</Button></Box>}
                                    </Paper>
                                </Stack>
                            </Grid>
                        </Grid>
                    )}
                </Container>
            </Box>

            {/* CREATE VEHICLE MODAL */}
            <Dialog open={openVehicleModal} onClose={() => setOpenVehicleModal(false)} PaperProps={{ sx: { borderRadius: '25px', p: 2, width: 500 } }}>
                <DialogTitle sx={{ fontWeight: 1000 }}>Add New Vehicle</DialogTitle>
                <DialogContent><Stack spacing={3} mt={1}>
                    <TextField fullWidth label="Vehicle Model" onChange={(e) => setNewVehicle({...newVehicle, vehicleType: e.target.value})} />
                    <TextField select fullWidth label="Select Provider" value={newVehicle.providerId} onChange={(e) => setNewVehicle({...newVehicle, providerId: e.target.value})}>
                        {providers.map((p) => (<MenuItem key={p.providerId} value={p.providerId}>{p.providerName}</MenuItem>))}
                    </TextField>
                    <TextField fullWidth label="Daily Rate (LKR)" type="number" onChange={(e) => setNewVehicle({...newVehicle, finalPrice: e.target.value})} />
                    <TextField fullWidth label="Allowed Mileage (km)" type="number" onChange={(e) => setNewVehicle({...newVehicle, allowedMileage: e.target.value})} />
                    <TextField fullWidth label="Vehicle Image URL" onChange={(e) => setNewVehicle({...newVehicle, imageUrl: e.target.value})} />
                    <Button variant="contained" fullWidth sx={{ py: 1.5, borderRadius: '12px', fontWeight: 800 }} onClick={handleAddVehicle}>Register Vehicle</Button>
                </Stack></DialogContent>
            </Dialog>

            {/* EDIT VEHICLE MODAL */}
            <Dialog open={openEditVehicleModal} onClose={() => setOpenEditVehicleModal(false)} PaperProps={{ sx: { borderRadius: '25px', p: 2, width: 500 } }}>
                <DialogTitle sx={{ fontWeight: 1000 }}>Update Vehicle</DialogTitle>
                <DialogContent><Stack spacing={3} mt={1}>
                    <TextField fullWidth label="Vehicle Model" value={editVehicle.vehicleType} onChange={(e) => setEditVehicle({...editVehicle, vehicleType: e.target.value})} />
                    <TextField select fullWidth label="Select Provider" value={editVehicle.providerId} onChange={(e) => setEditVehicle({...editVehicle, providerId: e.target.value})}>
                        {providers.map((p) => (<MenuItem key={p.providerId} value={p.providerId}>{p.providerName}</MenuItem>))}
                    </TextField>
                    <TextField fullWidth label="Daily Rate (LKR)" type="number" value={editVehicle.finalPrice} onChange={(e) => setEditVehicle({...editVehicle, finalPrice: e.target.value})} />
                    <TextField fullWidth label="Allowed Mileage (km)" type="number" value={editVehicle.allowedMileage} onChange={(e) => setEditVehicle({...editVehicle, allowedMileage: e.target.value})} />
                    <TextField fullWidth label="Vehicle Image URL" value={editVehicle.imageUrl} onChange={(e) => setEditVehicle({...editVehicle, imageUrl: e.target.value})} />
                    <Button variant="contained" fullWidth sx={{ py: 1.5, borderRadius: '12px', fontWeight: 800 }} onClick={handleUpdateVehicle}>Update Vehicle</Button>
                </Stack></DialogContent>
            </Dialog>

            {/* PROVIDER & USER MODALS */}
            <Dialog open={openProviderModal} onClose={() => setOpenProviderModal(false)} PaperProps={{ sx: { borderRadius: '25px', p: 2, width: 450 } }}>
                <DialogTitle sx={{ fontWeight: 1000 }}>Register New Provider</DialogTitle>
                <DialogContent><Stack spacing={3} mt={1}>
                    <TextField fullWidth label="Company Name" onChange={(e) => setNewProvider({...newProvider, providerName: e.target.value})} />
                    <TextField fullWidth label="Mobile Number" onChange={(e) => setNewProvider({...newProvider, phoneNo: e.target.value})} />
                    <TextField fullWidth label="Official Email" onChange={(e) => setNewProvider({...newProvider, email: e.target.value})} />
                    <Button variant="contained" fullWidth sx={{ py: 1.5, borderRadius: '12px', fontWeight: 800 }} onClick={handleAddProvider}>Save Provider</Button>
                </Stack></DialogContent>
            </Dialog>

            <Dialog open={openEditProviderModal} onClose={() => setOpenEditProviderModal(false)} PaperProps={{ sx: { borderRadius: '20px', p: 1 } }}>
                <DialogTitle sx={{fontWeight: 800}}>Edit Provider</DialogTitle>
                <DialogContent><Stack spacing={3} mt={1}>
                    <TextField fullWidth label="Provider Name" value={editProvider.providerName} onChange={(e) => setEditProvider({...editProvider, providerName: e.target.value})} />
                    <TextField fullWidth label="Contact" value={editProvider.phoneNo} onChange={(e) => setEditProvider({...editProvider, phoneNo: e.target.value})} />
                    <Button variant="contained" sx={{borderRadius: '10px'}} onClick={handleUpdateProvider}>Update Details</Button>
                </Stack></DialogContent>
            </Dialog>

            <Dialog open={openEditUserModal} onClose={() => setOpenEditUserModal(false)} PaperProps={{ sx: { borderRadius: '20px', p: 1 } }}>
                <DialogTitle sx={{fontWeight: 800}}>Edit User Info</DialogTitle>
                <DialogContent><Stack spacing={3} mt={1}>
                    <TextField fullWidth label="Username" value={editUser.username} onChange={(e) => setEditUser({...editUser, username: e.target.value})} />
                    <TextField fullWidth label="Email" value={editUser.email} onChange={(e) => setEditUser({...editUser, email: e.target.value})} />
                    <Button variant="contained" sx={{borderRadius: '10px'}} onClick={handleUpdateUser}>Save User</Button>
                </Stack></DialogContent>
            </Dialog>

            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}><Alert severity={snackbar.severity} sx={{ borderRadius: '12px', fontWeight: 700 }}>{snackbar.message}</Alert></Snackbar>
        </Box>
    );
};

export default AdminDashboard;