import React, { useState, useEffect, useCallback } from 'react';
import { 
    Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, 
    TableHead, TableRow, IconButton, Chip, Stack, CircularProgress, 
    Snackbar, Alert, Container, Button, Modal, Fade, Backdrop, TextField
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import apiClient from '../api/axiosConfig';
import { authService } from '../api/authService';
import Swal from 'sweetalert2'; // 🔥 Professional Alerts damma

// Icons
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import GetAppIcon from '@mui/icons-material/GetApp';
import HistoryIcon from '@mui/icons-material/History';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

const CustomerDashboard = () => {
    const theme = useTheme();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    
    // Edit Modal States
    const [openEdit, setOpenEdit] = useState(false);
    const [selectedReq, setSelectedReq] = useState(null);
    const [editDate, setEditDate] = useState('');

    const fetchData = useCallback(async () => {
        const customerId = authService.getUserId();
        const token = localStorage.getItem('token'); 

        if (!customerId || customerId === 'null' || !token) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await apiClient.get(`/booking-requests/customer/${customerId}`);
            setRequests(response.data || []);
        } catch (err) {
            console.error("Dashboard Fetch Error:", err);
            setSnackbar({ open: true, message: "Failed to sync your activities", severity: "error" });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    // 1. DELETE / CANCEL REQUEST
    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Cancel Inquiry?',
            text: "Are you sure you want to remove this rental request?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, Cancel it!',
            borderRadius: '20px'
        });

        if (result.isConfirmed) {
            try {
                await apiClient.delete(`/booking-requests/${id}`); 
                Swal.fire({ title: 'Cancelled!', text: 'Your inquiry has been removed.', icon: 'success', borderRadius: '20px' });
                fetchData();
            } catch (err) {
                setSnackbar({ open: true, message: "Cancellation failed", severity: "error" });
            }
        }
    };

    // 2. OPEN EDIT MODAL
    const handleEditClick = (req) => {
        setSelectedReq(req);
        setEditDate(req.pickupDate);
        setOpenEdit(true);
    };

    // 3. UPDATE REQUEST
    const handleUpdate = async () => {
        try {
            const payload = { pickupDate: editDate };
            await apiClient.put(`/booking-requests/${selectedReq.requestId}`, payload);
            
            setSnackbar({ open: true, message: "Pickup date updated successfully!", severity: "success" });
            setOpenEdit(false);
            fetchData();
        } catch (err) {
            setSnackbar({ open: true, message: "Update failed", severity: "error" });
        }
    };

    // 🔥 4. DOWNLOAD PDF INVOICE (Fixed with Blob to avoid 403)
    const downloadInvoice = async (bookingId) => {
        try {
            setSnackbar({ open: true, message: "Generating PDF Invoice...", severity: "info" });
            
            // Axios request with responseType 'blob' ensures JWT is sent and PDF is handled correctly
            const response = await apiClient.get(`/booking-requests/receipt/${bookingId}`, {
                responseType: 'blob', 
            });

            // Creating a downloadable URL for the blob
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Invoice_DE-${bookingId}.pdf`); 
            document.body.appendChild(link);
            link.click();
            
            // Clean up
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);

        } catch (err) {
            console.error("PDF Error:", err);
            setSnackbar({ open: true, message: "Could not generate invoice. Security block or server error.", severity: "error" });
        }
    };

    return (
        <Container maxWidth="xl" sx={{ pt: 15, pb: 10 }}>
            
            {/* Header Area */}
            <Stack direction="row" justifyContent="space-between" alignItems="flex-end" mb={6}>
                <Box>
                    <Typography variant="h3" fontWeight={1000} sx={{ letterSpacing: -1.5, color: '#1b2559' }}>
                        My <span style={{ color: theme.palette.primary.main }}>Activity</span>
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>Monitor your premium bookings and inquiry status.</Typography>
                </Box>
                <Button 
                    variant="contained" 
                    startIcon={<HistoryIcon />} 
                    onClick={fetchData} 
                    sx={{ borderRadius: '15px', px: 3, py: 1.2, fontWeight: 800, textTransform: 'none' }}
                >
                    Refresh Status
                </Button>
            </Stack>

            {/* Main Data Table */}
            <TableContainer component={Paper} sx={{ borderRadius: '35px', border: '1px solid #e2e8f0', boxShadow: '0 20px 60px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f8fafc' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 800, py: 3, pl: 5 }}>BOOKING REF</TableCell>
                            <TableCell sx={{ fontWeight: 800 }}>VEHICLE MODEL</TableCell>
                            <TableCell sx={{ fontWeight: 800 }}>SCHEDULED DATE</TableCell>
                            <TableCell sx={{ fontWeight: 800 }}>TOTAL BILL</TableCell>
                            <TableCell sx={{ fontWeight: 800 }}>LIVE STATUS</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 800, pr: 5 }}>ACTIONS</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={6} align="center" sx={{ py: 10 }}><CircularProgress /></TableCell></TableRow>
                        ) : requests.length === 0 ? (
                            <TableRow><TableCell colSpan={6} align="center" sx={{ py: 10 }}>
                                <Typography color="text.secondary" fontWeight={600}>You haven't made any inquiries yet.</Typography>
                            </TableCell></TableRow>
                        ) : requests.slice().reverse().map((item) => (
                            <TableRow key={item.requestId} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell sx={{ pl: 5, fontWeight: 900, color: theme.palette.primary.main }}>#DE-{item.requestId}</TableCell>
                                <TableCell>
                                    <Typography fontWeight={800} color="#1b2559">{item.vehicleType}</Typography>
                                    <Typography variant="caption" color="text.secondary" fontWeight={700}>
                                        Agent: {item.agent?.username || "Awaiting Allocation"}
                                    </Typography>
                                </TableCell>
                                <TableCell sx={{ fontWeight: 700, color: '#4a5568' }}>{item.pickupDate}</TableCell>
                                <TableCell>
                                    <Typography fontWeight={1000} color="#1b2559">LKR {item.finalPrice?.toLocaleString()}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip 
                                        label={item.status || "PENDING"} 
                                        color={item.status === 'APPROVED' ? 'success' : item.status === 'REJECTED' ? 'error' : 'warning'} 
                                        sx={{ fontWeight: 900, borderRadius: '10px', fontSize: '0.75rem' }} 
                                    />
                                </TableCell>
                                <TableCell align="right" sx={{ pr: 5 }}>
                                    <Stack direction="row" spacing={1.5} justifyContent="flex-end">
                                        {item.status === 'PENDING' ? (
                                            <>
                                                <IconButton onClick={() => handleEditClick(item)} sx={{ bgcolor: '#eff6ff', color: '#3b82f6', '&:hover': { bgcolor: '#3b82f6', color: '#fff' } }}>
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton onClick={() => handleDelete(item.requestId)} sx={{ bgcolor: '#fff1f2', color: '#e11d48', '&:hover': { bgcolor: '#e11d48', color: '#fff' } }}>
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </>
                                        ) : item.status === 'APPROVED' ? (
                                            <Button 
                                                variant="contained" 
                                                size="small" 
                                                startIcon={<PictureAsPdfIcon />}
                                                onClick={() => downloadInvoice(item.requestId)}
                                                sx={{ 
                                                    borderRadius: '12px', 
                                                    textTransform: 'none', 
                                                    fontWeight: 900,
                                                    bgcolor: '#0f172a',
                                                    '&:hover': { bgcolor: '#1e293b' }
                                                }}
                                            >
                                                Invoice PDF
                                            </Button>
                                        ) : (
                                            <Typography variant="caption" color="text.disabled" fontWeight={800}>No Actions</Typography>
                                        )}
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Edit Pickup Date Modal */}
            <Modal open={openEdit} onClose={() => setOpenEdit(false)} closeAfterTransition BackdropComponent={Backdrop} BackdropProps={{ timeout: 500 }}>
                <Fade in={openEdit}>
                    <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 450, bgcolor: '#fff', borderRadius: '30px', p: 5, boxShadow: '0 30px 70px rgba(0,0,0,0.2)' }}>
                        <Typography variant="h5" fontWeight={1000} color="#1b2559" mb={1}>Reschedule Trip</Typography>
                        <Typography variant="body2" color="text.secondary" mb={4}>Update your preferred pickup date for this vehicle.</Typography>
                        
                        <TextField 
                            fullWidth type="date" label="New Pickup Date" 
                            value={editDate} InputLabelProps={{ shrink: true }}
                            onChange={(e) => setEditDate(e.target.value)}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '15px' } }}
                        />
                        
                        <Stack direction="row" spacing={2} mt={4}>
                            <Button variant="outlined" fullWidth onClick={() => setOpenEdit(false)} sx={{ borderRadius: '15px', py: 1.5, fontWeight: 800 }}>Discard</Button>
                            <Button variant="contained" fullWidth onClick={handleUpdate} sx={{ borderRadius: '15px', py: 1.5, fontWeight: 800 }}>Confirm Update</Button>
                        </Stack>
                    </Box>
                </Fade>
            </Modal>

            {/* Notifications */}
            <Snackbar open={snackbar.open} autoHideDuration={5000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: '15px', fontWeight: 700 }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default CustomerDashboard;