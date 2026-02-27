import React, { useState, useEffect } from 'react';
import { 
    Container, TextField, Button, Typography, Paper, Box, Grid, 
    Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
    IconButton, MenuItem, Stack, Divider, Chip, Snackbar, Alert
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import GroupIcon from '@mui/icons-material/Group';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import EmailIcon from '@mui/icons-material/Email';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import BusinessIcon from '@mui/icons-material/Business';
import AdminService from '../api/Services/AdminService';

const AdminDashboard = () => {
    const PRIMARY_ORANGE = "#ff5722"; 
    const DARK_BG = "#000000"; 
    
    const [tabValue, setTabValue] = useState(0);
    const [bookings, setBookings] = useState([]);
    const [users, setUsers] = useState([]); 
    const [contracts, setContracts] = useState([]);
    const [providers, setProviders] = useState([]);
    const [messages, setMessages] = useState([]); 
    const [admins, setAdmins] = useState([]); 

    // --- 🔔 SUCCESS POP-UP STATES ---
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const [contractForm, setContractForm] = useState({ vehicleType: '', baseRatePerDay: '', providerId: '' });
    const [adminForm, setAdminForm] = useState({ username: '', password: '', email: '' }); 
    const [providerForm, setProviderForm] = useState({ providerName: '', contactNumber: '', email: '' });

    useEffect(() => {
        loadData();
        if (tabValue === 3) fetchMessages(); 
        if (tabValue === 4) fetchAdmins(); 
    }, [tabValue]);

    const loadData = async () => {
        try {
            const [bRes, uRes, cRes, pRes] = await AdminService.getDashboardData();
            setBookings(bRes.data || []);
            setUsers(uRes.data || []); 
            setContracts(cRes.data || []);
            setProviders(pRes.data || []);
        } catch (err) { console.error("Data loading failed", err); }
    };

    const fetchMessages = async () => {
        try {
            const res = await AdminService.getContactMessages(); 
            setMessages(res.data || []);
        } catch (err) { console.error("Messages loading failed", err); }
    };

    const fetchAdmins = async () => {
        try {
            const res = await AdminService.getAllAdmins(); 
            setAdmins(res.data || []);
        } catch (err) { console.error("Admins loading failed", err); }
    };

    // --- POP-UP HANDLERS ---
    const showPopup = (msg, sev = 'success') => setSnackbar({ open: true, message: msg, severity: sev });
    const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

    const handleEditContract = (c) => {
        const id = c.contractId || c.id;
        setSelectedId(id);
        setContractForm({ vehicleType: c.vehicleType, baseRatePerDay: c.baseRatePerDay, providerId: c.provider?.providerId || '' });
        setIsEditMode(true);
    };

    const resetForms = () => {
        setContractForm({ vehicleType: '', baseRatePerDay: '', providerId: '' });
        setAdminForm({ username: '', password: '', email: '' });
        setProviderForm({ providerName: '', contactNumber: '', email: '' });
        setIsEditMode(false);
        setSelectedId(null);
    };

    // --- 💾 DATABASE ACTIONS WITH POP-UPS ---

    const onAddProvider = async (e) => {
        e.preventDefault();
        try {
            await AdminService.addProvider(providerForm);
            showPopup("Provider Registered Successfully!"); // Success Message
            resetForms();
            loadData();
        } catch (err) { showPopup("Registration Failed!", "error"); }
    };

    const onSaveContract = async (e) => {
        e.preventDefault();
        try {
            if (isEditMode) {
                await AdminService.updateContract(selectedId, contractForm);
                showPopup("Contract Updated Successfully!");
            } else {
                await AdminService.uploadContract(contractForm);
                showPopup("New Inventory Added to Fleet!");
            }
            resetForms();
            loadData();
        } catch (err) { showPopup("Error Saving Record!", "error"); }
    };

    const onRegisterAdmin = async (e) => {
        e.preventDefault();
        try {
            await AdminService.registerAdmin({ ...adminForm, role: 'ADMIN' });
            showPopup("New Admin Authorized!");
            resetForms();
            fetchAdmins();
        } catch (err) { showPopup("Registration Failed!", "error"); }
    };

    const onUpdateAdmin = async (e) => {
        e.preventDefault();
        try {
            await AdminService.updateAdmin(selectedId, adminForm);
            showPopup("Admin Profile Updated!");
            resetForms();
            fetchAdmins();
        } catch (err) { showPopup("Update Failed!", "error"); }
    };

    const deleteRecord = async (id) => {
        if(window.confirm("Confirm permanent deletion?")) {
            try {
                await AdminService.deleteUser(id);
                showPopup("Record Deleted Permanently!");
                loadData();
                fetchAdmins();
            } catch (err) { showPopup("Deletion Failed!", "error"); }
        }
    };

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 }
    };

    const tableHeaderStyle = { 
        bgcolor: '#111', 
        '& .MuiTableCell-root': { color: PRIMARY_ORANGE, fontWeight: 'bold', borderBottom: '1px solid #222', textAlign: 'center' } 
    };

    return (
        <Box sx={{ bgcolor: DARK_BG, minHeight: '100vh', color: '#fff', pb: 10 }}>
            
            {/* --- HERO HEADER (Metrics used to clean warnings) --- */}
            <Box sx={{ py: 6, textAlign: 'center', background: 'linear-gradient(to bottom, #111 0%, #000 100%)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <Typography variant="h2" fontWeight="900">ADMIN <span style={{ color: PRIMARY_ORANGE }}>CENTRAL</span></Typography>
                    <Box sx={{ width: 80, height: 4, bgcolor: PRIMARY_ORANGE, mx: 'auto', mt: 2, mb: 4 }} />
                </motion.div>
                
                <Stack direction="row" justifyContent="center" spacing={{xs: 2, md: 6}} sx={{ mt: 2 }}>
                    <Box sx={{ textAlign: 'center' }}>
                        <AccountBalanceWalletIcon sx={{ color: PRIMARY_ORANGE, fontSize: 30 }} />
                        <Typography variant="h5" fontWeight="bold">{bookings.length}</Typography>
                        <Typography variant="caption" sx={{ opacity: 0.5, letterSpacing: 2 }}>TOTAL SALES</Typography>
                    </Box>
                    <Divider orientation="vertical" flexItem sx={{ bgcolor: '#333' }} />
                    <Box sx={{ textAlign: 'center' }}>
                        <GroupIcon sx={{ color: PRIMARY_ORANGE, fontSize: 30 }} /> 
                        <Typography variant="h5" fontWeight="bold">{users.length}</Typography> 
                        <Typography variant="caption" sx={{ opacity: 0.5, letterSpacing: 2 }}>ACTIVE USERS</Typography>
                    </Box>
                </Stack>
            </Box>

            <Container maxWidth="lg">
                <Stack alignItems="center" my={6}>
                    <Tabs value={tabValue} onChange={(e, val) => { setTabValue(val); resetForms(); }} variant="scrollable" scrollButtons="auto"
                        sx={{ '& .MuiTab-root': { color: 'rgba(255,255,255,0.5)', fontWeight: 'bold', px: 4 }, '& .Mui-selected': { color: PRIMARY_ORANGE }, '& .MuiTabs-indicator': { bgcolor: PRIMARY_ORANGE, height: 3 } }}>
                        <Tab label="BOOKINGS" icon={<BookOnlineIcon fontSize="small"/>} iconPosition="start" />
                        <Tab label="INVENTORY" icon={<DirectionsCarIcon fontSize="small"/>} iconPosition="start" />
                        <Tab label="PROVIDERS" icon={<BusinessIcon fontSize="small"/>} iconPosition="start" />
                        <Tab label="MESSAGES" icon={<EmailIcon fontSize="small"/>} iconPosition="start" />
                        <Tab label="ADMINS" icon={<AdminPanelSettingsIcon fontSize="small"/>} iconPosition="start" />
                    </Tabs>
                </Stack>

                <AnimatePresence mode="wait">
                    <Box sx={{ minHeight: '400px' }}>
                        
                        {/* 0. BOOKINGS TAB */}
                        {tabValue === 0 && (
                            <motion.div key="bookings" {...fadeInUp}>
                                <TableContainer component={Paper} sx={{ bgcolor: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 0 }}>
                                    <Table>
                                        <TableHead sx={tableHeaderStyle}><TableRow><TableCell>ID</TableCell><TableCell>CUSTOMER</TableCell><TableCell>VEHICLE</TableCell><TableCell>TOTAL</TableCell></TableRow></TableHead>
                                        <TableBody>
                                            {bookings.map(b => (
                                                <TableRow key={b.bookingId} hover><TableCell align="center" sx={{ color: '#fff' }}>#{b.bookingId}</TableCell><TableCell align="center" sx={{ color: '#fff' }}>{b.customerName}</TableCell><TableCell align="center" sx={{ color: PRIMARY_ORANGE }}>{b.vehicleContract?.vehicleType}</TableCell><TableCell align="center" sx={{ color: '#fff' }}>LKR {b.finalPrice}</TableCell></TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </motion.div>
                        )}

                        {/* 1. INVENTORY TAB */}
                        {tabValue === 1 && (
                            <motion.div key="inventory" {...fadeInUp}>
                                <Grid container spacing={4} justifyContent="center">
                                    <Grid item xs={12} md={4}>
                                        <Paper sx={{ p: 4, bgcolor: '#111', border: '1px solid #333', borderRadius: 0 }}>
                                            <Typography variant="h6" fontWeight="900" color={PRIMARY_ORANGE} mb={3} textAlign="center">{isEditMode ? "EDIT CONTRACT" : "ADD CONTRACT"}</Typography>
                                            <Stack spacing={3}>
                                                <TextField fullWidth label="VEHICLE TYPE" variant="standard" value={contractForm.vehicleType} onChange={(e) => setContractForm({...contractForm, vehicleType: e.target.value})} inputProps={{style: {color: '#fff'}}} InputLabelProps={{shrink: true, style: {color: PRIMARY_ORANGE}}} />
                                                <TextField fullWidth label="DAILY RATE" variant="standard" type="number" value={contractForm.baseRatePerDay} onChange={(e) => setContractForm({...contractForm, baseRatePerDay: e.target.value})} inputProps={{style: {color: '#fff'}}} InputLabelProps={{shrink: true, style: {color: PRIMARY_ORANGE}}} />
                                                <TextField select fullWidth label="PROVIDER" variant="standard" value={contractForm.providerId} onChange={(e) => setContractForm({...contractForm, providerId: e.target.value})} SelectProps={{style: {color: '#fff'}}} InputLabelProps={{shrink: true, style: {color: '#555'}}}>
                                                    {providers.map(p => <MenuItem key={p.providerId} value={p.providerId}>{p.providerName}</MenuItem>)}
                                                </TextField>
                                                <Button fullWidth variant="contained" sx={{ bgcolor: PRIMARY_ORANGE, py: 1.5, fontWeight: '900' }} onClick={onSaveContract}>SAVE</Button>
                                                {isEditMode && <Button fullWidth sx={{ color: '#fff', mt: 1 }} onClick={resetForms}>CANCEL</Button>}
                                            </Stack>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} md={8}>
                                        <TableContainer component={Paper} sx={{ bgcolor: '#0a0a0a', border: '1px solid #1a1a1a' }}>
                                            <Table>
                                                <TableHead sx={tableHeaderStyle}><TableRow><TableCell>VEHICLE</TableCell><TableCell>RATE</TableCell><TableCell>ACTION</TableCell></TableRow></TableHead>
                                                <TableBody>
                                                    {contracts.map(c => (<TableRow key={c.contractId || c.id} hover><TableCell align="center" sx={{ color: '#fff' }}>{c.vehicleType}</TableCell><TableCell align="center" sx={{ color: '#fff' }}>LKR {c.baseRatePerDay}</TableCell><TableCell align="center"><IconButton sx={{ color: PRIMARY_ORANGE }} onClick={() => handleEditContract(c)}><EditIcon fontSize="small" /></IconButton></TableCell></TableRow>))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Grid>
                                </Grid>
                            </motion.div>
                        )}

                        {/* 2. PROVIDERS TAB */}
                        {tabValue === 2 && (
                            <motion.div key="providers" {...fadeInUp}>
                                <Grid container spacing={4} justifyContent="center">
                                    <Grid item xs={12} md={4}>
                                        <Paper sx={{ p: 4, bgcolor: '#111', border: '1px solid #333', borderRadius: 0 }}>
                                            <Typography variant="h6" color={PRIMARY_ORANGE} mb={3} textAlign="center">REGISTER PROVIDER</Typography>
                                            <Stack spacing={3}>
                                                <TextField fullWidth label="NAME" variant="standard" value={providerForm.providerName} onChange={(e) => setProviderForm({...providerForm, providerName: e.target.value})} inputProps={{style: {color: '#fff'}}} InputLabelProps={{shrink: true, style: {color: PRIMARY_ORANGE}}} />
                                                <TextField fullWidth label="CONTACT NUMBER" variant="standard" value={providerForm.contactNumber} onChange={(e) => setProviderForm({...providerForm, contactNumber: e.target.value})} inputProps={{style: {color: '#fff'}}} InputLabelProps={{shrink: true, style: {color: PRIMARY_ORANGE}}} />
                                                <TextField fullWidth label="EMAIL" variant="standard" value={providerForm.email} onChange={(e) => setProviderForm({...providerForm, email: e.target.value})} inputProps={{style: {color: '#fff'}}} InputLabelProps={{shrink: true, style: {color: PRIMARY_ORANGE}}} />
                                                <Button variant="contained" fullWidth onClick={onAddProvider} sx={{ bgcolor: PRIMARY_ORANGE, fontWeight: '900' }}>REGISTER</Button>
                                            </Stack>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} md={8}>
                                        <TableContainer component={Paper} sx={{ bgcolor: '#0a0a0a', border: '1px solid #1a1a1a' }}>
                                            <Table>
                                                <TableHead sx={tableHeaderStyle}><TableRow><TableCell>ID</TableCell><TableCell>PROVIDER NAME</TableCell><TableCell>CONTACT</TableCell></TableRow></TableHead>
                                                <TableBody>
                                                    {providers.map(p => (<TableRow key={p.providerId} hover><TableCell align="center" sx={{ color: '#fff' }}>#{p.providerId}</TableCell><TableCell align="center" sx={{ color: '#fff', fontWeight: 'bold' }}>{p.providerName}</TableCell><TableCell align="center" sx={{ color: 'rgba(255,255,255,0.6)' }}>{p.contactNumber}</TableCell></TableRow>))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Grid>
                                </Grid>
                            </motion.div>
                        )}

                        {/* 3. MESSAGES TAB (FIXED: messages state used) */}
                        {tabValue === 3 && (
                            <motion.div key="messages" {...fadeInUp}>
                                <Stack alignItems="center">
                                    <TableContainer component={Paper} sx={{ bgcolor: '#0a0a0a', border: '1px solid #1a1a1a', maxWidth: '900px' }}>
                                        <Table>
                                            <TableHead sx={tableHeaderStyle}><TableRow><TableCell>CUSTOMER</TableCell><TableCell>MESSAGE</TableCell></TableRow></TableHead>
                                            <TableBody>
                                                {messages.length > 0 ? messages.map(m => (
                                                    <TableRow key={m.id} hover>
                                                        <TableCell align="center" sx={{ color: '#fff', fontWeight: 'bold' }}>{m.firstName?.toUpperCase()}</TableCell>
                                                        <TableCell align="center" sx={{ color: 'rgba(255,255,255,0.7)', fontStyle: 'italic' }}>"{m.message}"</TableCell>
                                                    </TableRow>
                                                )) : <TableRow><TableCell colSpan={2} align="center" sx={{py: 5, color:'#444'}}>NO NEW MESSAGES</TableCell></TableRow>}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Stack>
                            </motion.div>
                        )}

                        {/* 4. ADMINS TAB */}
                        {tabValue === 4 && (
                            <motion.div key="admins" {...fadeInUp}>
                                <Grid container spacing={4} justifyContent="center">
                                    <Grid item xs={12} md={4}>
                                        <Paper sx={{ p: 4, bgcolor: '#111', border: '1px solid #333', borderRadius: 0 }}>
                                            <Typography variant="h6" color={PRIMARY_ORANGE} mb={3} textAlign="center">{isEditMode ? "EDIT ADMIN" : "NEW ADMIN"}</Typography>
                                            <Stack spacing={3}>
                                                <TextField fullWidth label="USERNAME" variant="standard" value={adminForm.username} onChange={(e) => setAdminForm({...adminForm, username: e.target.value})} inputProps={{style: {color: '#fff'}}} InputLabelProps={{shrink: true, style: {color: PRIMARY_ORANGE}}} />
                                                <TextField fullWidth label="EMAIL ADDRESS" variant="standard" value={adminForm.email} onChange={(e) => setAdminForm({...adminForm, email: e.target.value})} inputProps={{style: {color: '#fff'}}} InputLabelProps={{shrink: true, style: {color: PRIMARY_ORANGE}}} />
                                                {!isEditMode && <TextField fullWidth label="PASSWORD" type="password" variant="standard" value={adminForm.password} onChange={(e) => setAdminForm({...adminForm, password: e.target.value})} inputProps={{style: {color: '#fff'}}} InputLabelProps={{shrink: true, style: {color: PRIMARY_ORANGE}}} />}
                                                <Button variant="contained" fullWidth onClick={isEditMode ? onUpdateAdmin : onRegisterAdmin} sx={{ bgcolor: PRIMARY_ORANGE, fontWeight: '900', py: 1.5 }}>
                                                    {isEditMode ? "SAVE CHANGES" : "AUTHORIZE ADMIN"}
                                                </Button>
                                                {isEditMode && <Button fullWidth sx={{ color: '#fff', mt: 1 }} onClick={resetForms}>CANCEL</Button>}
                                            </Stack>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} md={8}>
                                        <TableContainer component={Paper} sx={{ bgcolor: '#0a0a0a', border: '1px solid #1a1a1a' }}>
                                            <Table>
                                                <TableHead sx={tableHeaderStyle}><TableRow><TableCell>NAME</TableCell><TableCell>EMAIL</TableCell><TableCell>STATUS</TableCell><TableCell>ACTION</TableCell></TableRow></TableHead>
                                                <TableBody>
                                                    {admins.map((admin) => (
                                                        <TableRow key={admin.userId} hover>
                                                            <TableCell align="center" sx={{ color: '#fff', fontWeight: 'bold' }}>{admin.username}</TableCell>
                                                            <TableCell align="center" sx={{ color: 'rgba(255,255,255,0.6)' }}>{admin.email}</TableCell>
                                                            <TableCell align="center"><Chip label="MASTER" size="small" sx={{ bgcolor: '#1b3320', color: '#4caf50', borderRadius: 0, fontWeight: 'bold' }} /></TableCell>
                                                            <TableCell align="center">
                                                                <IconButton sx={{ color: PRIMARY_ORANGE }} onClick={() => { setSelectedId(admin.userId); setAdminForm({username: admin.username, email: admin.email}); setIsEditMode(true); }}><EditIcon fontSize="small" /></IconButton>
                                                                <IconButton sx={{ color: '#ff1744' }} onClick={() => deleteRecord(admin.userId)}><DeleteIcon fontSize="small" /></IconButton>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Grid>
                                </Grid>
                            </motion.div>
                        )}
                    </Box>
                </AnimatePresence>
            </Container>

            {/* --- 🔔 SUCCESS NOTIFICATION (SNACKBAR) --- */}
            <Snackbar 
                open={snackbar.open} 
                autoHideDuration={4000} 
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%', bgcolor: '#1b3320', color: '#4caf50', fontWeight: 'bold', border: '1px solid #4caf50' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default AdminDashboard;