import React, { useState, useEffect } from 'react';
import { 
    Container, TextField, Button, Typography, Paper, Box, Grid, 
    Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
    IconButton, MenuItem, Stack, Divider, Chip, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Card, CardContent,
    Switch // Switch import kalaa
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
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AdminService from '../api/Services/AdminService';

const AdminDashboard = () => {
    const PRIMARY_ORANGE = "#ff5722"; 
    const DARK_BG = "#000000"; 
    const GLASS_BG = "rgba(15, 15, 15, 0.95)";
    
    const [tabValue, setTabValue] = useState(0);
    const [bookings, setBookings] = useState([]);
    const [users, setUsers] = useState([]); 
    const [contracts, setContracts] = useState([]);
    const [providers, setProviders] = useState([]);
    const [messages, setMessages] = useState([]); 
    const [admins, setAdmins] = useState([]); 

    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const [openBookingEdit, setOpenBookingEdit] = useState(false);
    const [bookingForm, setBookingForm] = useState({ customerName: '', pickupDate: '' });

    const [contractForm, setContractForm] = useState({ vehicleType: '', baseRatePerDay: '', providerId: '' });
    const [adminForm, setAdminForm] = useState({ username: '', password: '', email: '' }); 

    const [providerForm, setProviderForm] = useState({ 
        providerName: '', 
        contactDetails: '', 
        phoneNo: '', 
        email: '', 
        address: '' 
    });

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

    // --- TOGGLE LOGIC ---
    const toggleAvailability = async (contractId, currentStatus) => {
        try {
            // Backend ekata status eka update karanna (API ekak thiyenna oni mekata)
            await AdminService.updateContractStatus(contractId, !currentStatus);
            showPopup(`Vehicle marked as ${!currentStatus ? 'Available' : 'Rented'}`);
            loadData(); // Table eka refresh karanna
        } catch (err) {
            showPopup("Status update failed!", "error");
        }
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

    const showPopup = (msg, sev = 'success') => setSnackbar({ open: true, message: msg, severity: sev });
    const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

    const handleEditProvider = (p) => {
        setSelectedId(p.providerId);
        setProviderForm({ 
            providerName: p.providerName, 
            contactDetails: p.contactDetails, 
            phoneNo: p.phoneNo, 
            email: p.email, 
            address: p.address 
        });
        setIsEditMode(true);
    };

    const deleteProvider = async (id) => {
        if(window.confirm("Permanently remove this vehicle provider?")) {
            try {
                await AdminService.deleteProvider(id);
                showPopup("Provider Removed!");
                loadData();
            } catch (err) { showPopup("Deletion Failed!", "error"); }
        }
    };

    const onAddProvider = async (e) => {
        e.preventDefault();
        try {
            if (isEditMode) {
                await AdminService.updateProvider(selectedId, providerForm);
                showPopup("Provider Details Updated!");
            } else {
                await AdminService.addProvider(providerForm);
                showPopup("Provider Registered Successfully!");
            }
            resetForms();
            loadData();
        } catch (err) { showPopup("Action Failed!", "error"); }
    };

    const handleEditBooking = (b) => {
        setSelectedId(b.bookingId);
        setBookingForm({ customerName: b.customerName || '', pickupDate: b.pickupDate || '' });
        setOpenBookingEdit(true);
    };

    const onUpdateBooking = async () => {
        try {
            await AdminService.updateBooking(selectedId, bookingForm);
            showPopup("Booking Updated Successfully!");
            setOpenBookingEdit(false);
            loadData();
        } catch (err) { showPopup("Update Failed!", "error"); }
    };

    const deleteBooking = async (id) => {
        if(window.confirm("Delete this booking record permanently?")) {
            try {
                await AdminService.deleteBooking(id);
                showPopup("Booking Deleted!");
                loadData();
            } catch (err) { showPopup("Deletion Failed!", "error"); }
        }
    };

    const handleEditContract = (c) => {
        const id = c.contractId || c.id;
        setSelectedId(id);
        setContractForm({ vehicleType: c.vehicleType, baseRatePerDay: c.baseRatePerDay, providerId: c.provider?.providerId || '' });
        setIsEditMode(true);
    };

    const resetForms = () => {
        setContractForm({ vehicleType: '', baseRatePerDay: '', providerId: '' });
        setAdminForm({ username: '', password: '', email: '' });
        setProviderForm({ providerName: '', contactDetails: '', phoneNo: '', email: '', address: '' });
        setIsEditMode(false);
        setSelectedId(null);
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
        if(window.confirm("Confirm permanent deletion of this record?")) {
            try {
                await AdminService.deleteUser(id);
                showPopup("Record Deleted Permanently!");
                loadData();
                fetchAdmins();
            } catch (err) { showPopup("Deletion Failed!", "error"); }
        }
    };

    const fadeInUp = {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const tableHeaderStyle = { 
        bgcolor: '#111', 
        '& .MuiTableCell-root': { color: PRIMARY_ORANGE, fontWeight: 'bold', borderBottom: '2px solid #222', textAlign: 'center', fontSize: '0.8rem', letterSpacing: 1 } 
    };

    const StatCard = ({ icon, title, value, color }) => (
        <Card sx={{ bgcolor: GLASS_BG, border: '1px solid rgba(255,255,255,0.05)', borderRadius: 0, minWidth: 200 }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
                {icon}
                <Typography variant="h4" fontWeight="bold" sx={{ color: '#fff', mt: 1 }}>{value}</Typography>
                <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', my: 1.5, mx: 4 }} />
                <Typography variant="caption" sx={{ color: color, letterSpacing: 2, fontWeight: 900 }}>{title}</Typography>
            </CardContent>
        </Card>
    );

    return (
        <Box sx={{ bgcolor: DARK_BG, minHeight: '100vh', color: '#fff', pb: 10 }}>
            
            {/* --- HERO SECTION --- */}
            <Box sx={{ py: 8, background: 'radial-gradient(circle at top, #1a1a1a 0%, #000 100%)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <Container maxWidth="lg">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
                        <Typography variant="overline" sx={{ color: PRIMARY_ORANGE, letterSpacing: 10, display: 'block', mb: 1, textAlign: 'center' }}>
                            SYSTEM OVERVIEW
                        </Typography>
                        <Typography variant="h2" fontWeight="900" align="center" sx={{ letterSpacing: -2, mb: 6 }}>
                            ADMIN <span style={{ color: PRIMARY_ORANGE }}>CENTRAL.</span>
                        </Typography>
                    </motion.div>

                    <Grid container spacing={3} justifyContent="center">
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard icon={<AccountBalanceWalletIcon sx={{ color: PRIMARY_ORANGE, fontSize: 40 }} />} title="TOTAL SALES" value={bookings.length} color={PRIMARY_ORANGE} />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard icon={<GroupIcon sx={{ color: PRIMARY_ORANGE, fontSize: 40 }} />} title="ACTIVE USERS" value={users.length} color={PRIMARY_ORANGE} />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard icon={<DirectionsCarIcon sx={{ color: PRIMARY_ORANGE, fontSize: 40 }} />} title="FLEET SIZE" value={contracts.length} color={PRIMARY_ORANGE} />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard icon={<TrendingUpIcon sx={{ color: PRIMARY_ORANGE, fontSize: 40 }} />} title="PERFORMANCE" value="98%" color={PRIMARY_ORANGE} />
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* --- NAVIGATION TABS --- */}
            <Container maxWidth="xl">
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 6 }}>
                    <Paper sx={{ bgcolor: 'rgba(255,255,255,0.02)', borderRadius: 10, px: 2 }}>
                        <Tabs value={tabValue} onChange={(e, val) => { setTabValue(val); resetForms(); }} variant="scrollable" scrollButtons="auto"
                            sx={{ '& .MuiTab-root': { color: 'rgba(255,255,255,0.4)', fontWeight: 'bold', py: 3, px: 4 }, '& .Mui-selected': { color: PRIMARY_ORANGE }, '& .MuiTabs-indicator': { bgcolor: PRIMARY_ORANGE, height: 4, borderRadius: '4px 4px 0 0' } }}>
                            <Tab label="BOOKINGS" icon={<BookOnlineIcon fontSize="small"/>} iconPosition="start" />
                            <Tab label="INVENTORY" icon={<DirectionsCarIcon fontSize="small"/>} iconPosition="start" />
                            <Tab label="PROVIDERS" icon={<BusinessIcon fontSize="small"/>} iconPosition="start" />
                            <Tab label="MESSAGES" icon={<EmailIcon fontSize="small"/>} iconPosition="start" />
                            <Tab label="ADMINS" icon={<AdminPanelSettingsIcon fontSize="small"/>} iconPosition="start" />
                            <Tab label="USERS" icon={<GroupIcon fontSize="small"/>} iconPosition="start" />
                        </Tabs>
                    </Paper>
                </Box>

                <AnimatePresence mode="wait">
                    <Box sx={{ minHeight: '500px' }}>
                        
                        {/* TAB 0: BOOKINGS Content same as before */}
                        {tabValue === 0 && (
                            <motion.div key="bookings" {...fadeInUp}>
                                <TableContainer component={Paper} sx={{ bgcolor: GLASS_BG, border: '1px solid rgba(255,255,255,0.05)', borderRadius: 0, maxWidth: '1000px', mx: 'auto' }}>
                                    <Table>
                                        <TableHead sx={tableHeaderStyle}>
                                            <TableRow>
                                                <TableCell>ID</TableCell>
                                                <TableCell>CUSTOMER</TableCell>
                                                <TableCell>VEHICLE</TableCell>
                                                <TableCell>TOTAL</TableCell>
                                                <TableCell>ACTION</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {bookings.map(b => (
                                                <TableRow key={b.bookingId} hover sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } }}>
                                                    <TableCell align="center" sx={{ color: 'rgba(255,255,255,0.5)' }}>#{b.bookingId}</TableCell>
                                                    <TableCell align="center" sx={{ color: '#fff', fontWeight: 'bold' }}>{b.customerName || b.customer?.username}</TableCell>
                                                    <TableCell align="center" sx={{ color: PRIMARY_ORANGE }}>{b.vehicleContract?.vehicleType}</TableCell>
                                                    <TableCell align="center" sx={{ color: '#fff' }}>LKR {b.finalPrice.toLocaleString()}</TableCell>
                                                    <TableCell align="center">
                                                        <IconButton sx={{ color: PRIMARY_ORANGE }} onClick={() => handleEditBooking(b)}><EditIcon fontSize="small" /></IconButton>
                                                        <IconButton sx={{ color: '#ff1744' }} onClick={() => deleteBooking(b.bookingId)}><DeleteIcon fontSize="small" /></IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </motion.div>
                        )}

                        {/* TAB 1: INVENTORY (UPDATED WITH STATUS TOGGLE) */}
                        {tabValue === 1 && (
                            <motion.div key="inventory" {...fadeInUp}>
                                <Grid container spacing={4} justifyContent="center">
                                    <Grid item xs={12} lg={4}>
                                        <Paper sx={{ p: 5, bgcolor: GLASS_BG, border: '1px solid #222', borderRadius: 0 }}>
                                            <Typography variant="h6" fontWeight="900" color={PRIMARY_ORANGE} mb={4} textAlign="center">{isEditMode ? "EDIT CONTRACT" : "ADD CONTRACT"}</Typography>
                                            <Stack spacing={3}>
                                                <TextField fullWidth label="VEHICLE TYPE" variant="standard" value={contractForm.vehicleType} onChange={(e) => setContractForm({...contractForm, vehicleType: e.target.value})} inputProps={{style: {color: '#fff'}}} InputLabelProps={{shrink: true, style: {color: PRIMARY_ORANGE}}} />
                                                <TextField fullWidth label="DAILY RATE" variant="standard" type="number" value={contractForm.baseRatePerDay} onChange={(e) => setContractForm({...contractForm, baseRatePerDay: e.target.value})} inputProps={{style: {color: '#fff'}}} InputLabelProps={{shrink: true, style: {color: PRIMARY_ORANGE}}} />
                                                <TextField select fullWidth label="PROVIDER" variant="standard" value={contractForm.providerId} onChange={(e) => setContractForm({...contractForm, providerId: e.target.value})} SelectProps={{style: {color: '#fff'}}} InputLabelProps={{shrink: true, style: {color: '#555'}}}>
                                                    {providers.map(p => <MenuItem key={p.providerId} value={p.providerId}>{p.providerName}</MenuItem>)}
                                                </TextField>
                                                <Button fullWidth variant="contained" sx={{ bgcolor: PRIMARY_ORANGE, py: 2, fontWeight: '900', letterSpacing: 2, mt: 2 }} onClick={onSaveContract}>SAVE TO FLEET</Button>
                                                {isEditMode && <Button fullWidth sx={{ color: 'rgba(255,255,255,0.5)', mt: 1 }} onClick={resetForms}>CANCEL</Button>}
                                            </Stack>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} lg={8}>
                                        <TableContainer component={Paper} sx={{ bgcolor: '#0a0a0a', border: '1px solid #1a1a1a' }}>
                                            <Table>
                                                <TableHead sx={tableHeaderStyle}>
                                                    <TableRow>
                                                        <TableCell>VEHICLE TYPE</TableCell>
                                                        <TableCell>DAILY RATE</TableCell>
                                                        <TableCell>STATUS</TableCell> {/* Status column */}
                                                        <TableCell>ACTION</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {contracts.map(c => (
                                                        <TableRow key={c.contractId || c.id} hover>
                                                            <TableCell align="center" sx={{ color: '#fff', fontWeight: 'bold' }}>{c.vehicleType}</TableCell>
                                                            <TableCell align="center" sx={{ color: PRIMARY_ORANGE }}>LKR {c.baseRatePerDay}</TableCell>
                                                            {/* TOGGLE COLUMN */}
                                                            <TableCell align="center">
                                                                <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
                                                                    <Typography variant="caption" sx={{ color: c.availabilityStatus ? PRIMARY_ORANGE : '#555', fontWeight: 'bold' }}>
                                                                        {c.availabilityStatus ? "AVAILABLE" : "RENTED"}
                                                                    </Typography>
                                                                    <Switch 
                                                                        size="small"
                                                                        checked={!c.availabilityStatus} // If status is false (rented), switch is ON
                                                                        onChange={() => toggleAvailability(c.contractId, c.availabilityStatus)}
                                                                        sx={{ 
                                                                            '& .MuiSwitch-switchBase.Mui-checked': { color: PRIMARY_ORANGE },
                                                                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: PRIMARY_ORANGE }
                                                                        }}
                                                                    />
                                                                </Stack>
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                <IconButton sx={{ color: PRIMARY_ORANGE }} onClick={() => handleEditContract(c)}><EditIcon fontSize="small" /></IconButton>
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

                        {/* Other tabs (2, 3, 4, 5) remain exactly as they were in your code */}
                        {tabValue === 2 && (
                            <motion.div key="providers" {...fadeInUp}>
                                <Grid container spacing={4} justifyContent="center">
                                    <Grid item xs={12} lg={3}>
                                        <Paper sx={{ p: 4, bgcolor: GLASS_BG, border: '1px solid #222', borderRadius: 0 }}>
                                            <Typography variant="h6" color={PRIMARY_ORANGE} mb={4} textAlign="center" fontWeight="bold">{isEditMode ? "EDIT PROVIDER" : "REGISTER PROVIDER"}</Typography>
                                            <Stack spacing={2.5}>
                                                <TextField fullWidth label="NAME" variant="standard" value={providerForm.providerName} onChange={(e) => setProviderForm({...providerForm, providerName: e.target.value})} inputProps={{style: {color: '#fff'}}} InputLabelProps={{shrink: true, style: {color: PRIMARY_ORANGE}}} />
                                                <TextField fullWidth label="CONTACT DETAILS" variant="standard" value={providerForm.contactDetails} onChange={(e) => setProviderForm({...providerForm, contactDetails: e.target.value})} inputProps={{style: {color: '#fff'}}} InputLabelProps={{shrink: true, style: {color: PRIMARY_ORANGE}}} />
                                                <TextField fullWidth label="PHONE NO" variant="standard" value={providerForm.phoneNo} onChange={(e) => setProviderForm({...providerForm, phoneNo: e.target.value})} inputProps={{style: {color: '#fff'}}} InputLabelProps={{shrink: true, style: {color: PRIMARY_ORANGE}}} />
                                                <TextField fullWidth label="EMAIL" variant="standard" value={providerForm.email} onChange={(e) => setProviderForm({...providerForm, email: e.target.value})} inputProps={{style: {color: '#fff'}}} InputLabelProps={{shrink: true, style: {color: PRIMARY_ORANGE}}} />
                                                <TextField fullWidth label="ADDRESS" variant="standard" value={providerForm.address} onChange={(e) => setProviderForm({...providerForm, address: e.target.value})} inputProps={{style: {color: '#fff'}}} InputLabelProps={{shrink: true, style: {color: PRIMARY_ORANGE}}} />
                                                <Button variant="contained" fullWidth onClick={onAddProvider} sx={{ bgcolor: PRIMARY_ORANGE, fontWeight: '900', mt: 3, py: 1.5 }}>{isEditMode ? "UPDATE" : "REGISTER"}</Button>
                                                {isEditMode && <Button fullWidth sx={{ color: '#555' }} onClick={resetForms}>CANCEL</Button>}
                                            </Stack>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} lg={9}>
                                        <TableContainer component={Paper} sx={{ bgcolor: '#0a0a0a', border: '1px solid #1a1a1a', overflowX: 'auto' }}>
                                            <Table size="small">
                                                <TableHead sx={tableHeaderStyle}>
                                                    <TableRow>
                                                        <TableCell>ID</TableCell>
                                                        <TableCell>NAME</TableCell>
                                                        <TableCell>DETAILS</TableCell>
                                                        <TableCell>PHONE</TableCell>
                                                        <TableCell>EMAIL</TableCell>
                                                        <TableCell>ADDRESS</TableCell>
                                                        <TableCell>ACTIONS</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {providers.map(p => (
                                                        <TableRow key={p.providerId} hover>
                                                            <TableCell align="center" sx={{ color: '#444' }}>#{p.providerId}</TableCell>
                                                            <TableCell align="center" sx={{ color: '#fff', fontWeight: 'bold' }}>{p.providerName}</TableCell>
                                                            <TableCell align="center" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>{p.contactDetails}</TableCell>
                                                            <TableCell align="center" sx={{ color: '#fff' }}>{p.phoneNo}</TableCell>
                                                            <TableCell align="center" sx={{ color: PRIMARY_ORANGE }}>{p.email}</TableCell>
                                                            <TableCell align="center" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>{p.address}</TableCell>
                                                            <TableCell align="center">
                                                                <Stack direction="row" spacing={0} justifyContent="center">
                                                                    <IconButton sx={{ color: PRIMARY_ORANGE }} onClick={() => handleEditProvider(p)}><EditIcon fontSize="small" /></IconButton>
                                                                    <IconButton sx={{ color: '#ff1744' }} onClick={() => deleteProvider(p.providerId)}><DeleteIcon fontSize="small" /></IconButton>
                                                                </Stack>
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

                        {tabValue === 3 && (
                            <motion.div key="messages" {...fadeInUp}>
                                <TableContainer component={Paper} sx={{ bgcolor: GLASS_BG, border: '1px solid #1a1a1a', maxWidth: '800px', mx: 'auto' }}>
                                    <Table>
                                        <TableHead sx={tableHeaderStyle}><TableRow><TableCell>SENDER</TableCell><TableCell>MESSAGE CONTENT</TableCell></TableRow></TableHead>
                                        <TableBody>
                                            {messages.length > 0 ? messages.map((m, index) => (
                                                <TableRow key={index} hover>
                                                    <TableCell align="center" sx={{ color: PRIMARY_ORANGE, fontWeight: 'bold' }}>{m.firstName}</TableCell>
                                                    <TableCell align="center" sx={{ color: 'rgba(255,255,255,0.7)', fontStyle: 'italic' }}>"{m.message}"</TableCell>
                                                </TableRow>
                                            )) : <TableRow><TableCell colSpan={2} align="center" sx={{color: '#444', py: 10}}>INBOX EMPTY</TableCell></TableRow>}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </motion.div>
                        )}

                        {tabValue === 4 && (
                            <motion.div key="admins" {...fadeInUp}>
                                <Grid container spacing={4} justifyContent="center">
                                    <Grid item xs={12} lg={4}>
                                        <Paper sx={{ p: 5, bgcolor: GLASS_BG, border: '1px solid #222', borderRadius: 0 }}>
                                            <Typography variant="h6" color={PRIMARY_ORANGE} mb={4} textAlign="center" fontWeight="bold">{isEditMode ? "MODIFY ADMIN" : "CREATE ADMIN"}</Typography>
                                            <Stack spacing={3}>
                                                <TextField fullWidth label="USERNAME" variant="standard" value={adminForm.username} onChange={(e) => setAdminForm({...adminForm, username: e.target.value})} inputProps={{style: {color: '#fff'}}} InputLabelProps={{shrink: true, style: {color: PRIMARY_ORANGE}}} />
                                                <TextField fullWidth label="EMAIL" variant="standard" value={adminForm.email} onChange={(e) => setAdminForm({...adminForm, email: e.target.value})} inputProps={{style: {color: '#fff'}}} InputLabelProps={{shrink: true, style: {color: PRIMARY_ORANGE}}} />
                                                {!isEditMode && <TextField fullWidth label="PASSWORD" type="password" variant="standard" value={adminForm.password} onChange={(e) => setAdminForm({...adminForm, password: e.target.value})} inputProps={{style: {color: '#fff'}}} InputLabelProps={{shrink: true, style: {color: PRIMARY_ORANGE}}} />}
                                                <Button variant="contained" fullWidth onClick={isEditMode ? onUpdateAdmin : onRegisterAdmin} sx={{ bgcolor: PRIMARY_ORANGE, fontWeight: '900', py: 2, mt: 2 }}>{isEditMode ? "UPDATE ACCOUNT" : "AUTHORIZE"}</Button>
                                                {isEditMode && <Button fullWidth sx={{ color: '#555' }} onClick={resetForms}>CANCEL</Button>}
                                            </Stack>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} lg={6}>
                                        <TableContainer component={Paper} sx={{ bgcolor: '#0a0a0a', border: '1px solid #1a1a1a' }}>
                                            <Table>
                                                <TableHead sx={tableHeaderStyle}><TableRow><TableCell>NAME</TableCell><TableCell>EMAIL</TableCell><TableCell>ACTION</TableCell></TableRow></TableHead>
                                                <TableBody>
                                                    {admins.map(admin => (
                                                        <TableRow key={admin.userId} hover>
                                                            <TableCell align="center" sx={{ color: '#fff', fontWeight: 'bold' }}>{admin.username}</TableCell>
                                                            <TableCell align="center" sx={{ color: 'rgba(255,255,255,0.6)' }}>{admin.email}</TableCell>
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

                        {tabValue === 5 && (
                            <motion.div key="users" {...fadeInUp}>
                                <TableContainer component={Paper} sx={{ bgcolor: GLASS_BG, border: '1px solid #1a1a1a', borderRadius: 0, maxWidth: '1000px', mx: 'auto' }}>
                                    <Table>
                                        <TableHead sx={tableHeaderStyle}>
                                            <TableRow>
                                                <TableCell>UID</TableCell>
                                                <TableCell>USERNAME</TableCell>
                                                <TableCell>EMAIL ADDRESS</TableCell>
                                                <TableCell>PERMISSION</TableCell>
                                                <TableCell>ACTION</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {users.map(u => (
                                                <TableRow key={u.userId} hover>
                                                    <TableCell align="center" sx={{ color: 'rgba(255,255,255,0.3)' }}>#{u.userId}</TableCell>
                                                    <TableCell align="center" sx={{ color: '#fff', fontWeight: 'bold' }}>{u.username}</TableCell>
                                                    <TableCell align="center" sx={{ color: 'rgba(255,255,255,0.7)' }}>{u.email}</TableCell>
                                                    <TableCell align="center">
                                                        <Chip label={u.role} size="small" sx={{ bgcolor: u.role === 'ADMIN' ? '#d32f2f' : PRIMARY_ORANGE, color: '#fff', fontWeight: '900', borderRadius: 0, fontSize: '0.65rem' }} />
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <IconButton sx={{ color: '#ff1744' }} onClick={() => deleteRecord(u.userId)}><DeleteIcon fontSize="small" /></IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </motion.div>
                        )}
                    </Box>
                </AnimatePresence>
            </Container>

            {/* --- DIALOGS & NOTIFICATIONS --- */}
            <Dialog open={openBookingEdit} onClose={() => setOpenBookingEdit(false)} PaperProps={{ sx: { bgcolor: '#111', color: '#fff', borderRadius: 0, border: '1px solid #333', p: 2 } }}>
                <DialogTitle sx={{ color: PRIMARY_ORANGE, fontWeight: 'bold', fontSize: '1.5rem' }}>UPDATE RESERVATION</DialogTitle>
                <DialogContent>
                    <Stack spacing={4} sx={{ mt: 3, minWidth: '350px' }}>
                        <TextField fullWidth label="CUSTOMER NAME" variant="standard" value={bookingForm.customerName} onChange={(e) => setBookingForm({...bookingForm, customerName: e.target.value})} inputProps={{style: {color: '#fff'}}} InputLabelProps={{shrink: true, style: {color: PRIMARY_ORANGE}}} />
                        <TextField fullWidth label="PICKUP DATE" type="date" variant="standard" value={bookingForm.pickupDate} onChange={(e) => setBookingForm({...bookingForm, pickupDate: e.target.value})} inputProps={{style: {color: '#fff'}}} InputLabelProps={{shrink: true, style: {color: PRIMARY_ORANGE}}} />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 4 }}>
                    <Button onClick={() => setOpenBookingEdit(false)} sx={{ color: 'rgba(255,255,255,0.5)' }}>CLOSE</Button>
                    <Button onClick={onUpdateBooking} variant="contained" sx={{ bgcolor: PRIMARY_ORANGE, fontWeight: 'bold', px: 4 }}>SAVE CHANGES</Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%', bgcolor: '#1b3320', color: '#4caf50', fontWeight: 'bold', border: '1px solid #4caf50', borderRadius: 0 }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default AdminDashboard;