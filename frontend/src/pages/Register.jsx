import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  TextField, 
  InputAdornment, 
  Paper, 
  Link,
  Checkbox,
  FormControlLabel,
  Grid,
  MenuItem,
  Stack 
} from '@mui/material';
import { authService } from '../api/authService'; // Imported the API service
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Icons
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';

const Register = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);

  // 1. ADDED: State to hold all form inputs
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'CUSTOMER'
  });

  // 2. ADDED: Function to handle typing in any text field
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value // Uses the 'name' attribute of the input
    });
  };

  // 3. ADDED: Function to handle the actual submission to the backend
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents the browser from refreshing the page

    // Check if the user agreed to the terms
    if (!agreed) {
      alert("You must agree to the Terms and Privacy Policy to register.");
      return;
    }

    try {
      // Call the API service we created
      const response = await authService.registerUser(formData);
      
      // If the backend returns a success code (200 or 201)
      if (response.status === 200 || response.status === 201) {
        alert("Registration Successful!");
        navigate('/login'); // Send them to the login page immediately
      }
    } catch (error) {
      console.error("Registration failed:", error);
      // Show backend error message if available, otherwise show default message
      alert(error.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  const inputStyles = {
    '& .MuiInput-underline:before': { borderBottomColor: 'rgba(0,0,0,0.15)' },
    '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottomColor: theme.palette.primary.main },
    '& .MuiInput-underline:after': { borderBottomColor: theme.palette.primary.main },
    '& .MuiInputLabel-root': { fontWeight: 600, color: theme.palette.text.secondary, fontSize: '0.9rem' },
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh', 
      width: '100vw',
      bgcolor: '#fffbf9', 
      overflow: 'hidden' 
    }}>
      
      {/* LEFT SIDE: DECORATION & CAR IMAGE */}
      <Box sx={{ width: { xs: '0%', md: '50%' }, display: { xs: 'none', md: 'flex' }, alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <Box sx={{ position: 'absolute', left: '-15%', width: '80%', paddingBottom: '80%', bgcolor: `${theme.palette.secondary.main}20`, borderRadius: '50%', zIndex: 0 }} />
        <Box sx={{ position: 'absolute', top: '20%', left: '20%', width: '25px', height: '25px', bgcolor: theme.palette.secondary.main, borderRadius: '50%', opacity: 0.6 }} />
        <Box sx={{ position: 'absolute', bottom: '15%', right: '20%', width: '15px', height: '15px', bgcolor: theme.palette.secondary.main, borderRadius: '50%', opacity: 0.8 }} />
        <motion.div initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8, ease: "easeOut" }} style={{ position: 'relative', zIndex: 1, width: '100%', display: 'flex', justifyContent: 'center' }}>
          <img src="https://pngimg.com/uploads/land_rover/land_rover_PNG80.png" alt="Premium Car" style={{ width: '90%', maxWidth: '650px', objectFit: 'contain', filter: 'drop-shadow(0px 20px 30px rgba(0,0,0,0.25))' }} />
        </motion.div>
      </Box>

      {/* RIGHT SIDE: REGISTRATION FORM */}
      <Box sx={{ width: { xs: '100%', md: '50%' }, display: 'flex', alignItems: 'center', justifyContent: 'center', p: { xs: 3, sm: 6 } }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} style={{ width: '100%', maxWidth: '480px' }}>
          
          {/* 4. ADDED: 'component="form"' and 'onSubmit' to trigger the API call */}
          <Paper component="form" onSubmit={handleSubmit} elevation={0} sx={{ p: { xs: 4, md: 6 }, borderRadius: '24px', boxShadow: '0px 20px 60px rgba(0, 0, 0, 0.08)', bgcolor: '#ffffff' }}>
            
            <Typography variant="h4" sx={{ fontWeight: 900, color: theme.palette.text.primary, mb: 1, textTransform: 'uppercase', letterSpacing: 1 }}>Welcome</Typography>
            <Typography variant="body2" sx={{ fontWeight: 800, color: theme.palette.text.secondary, mb: 5 }}>Let's get you started!</Typography>

            <Stack spacing={4} sx={{ mb: 4 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    fullWidth variant="standard" label="Username" placeholder="e.g. john_doe" InputLabelProps={{ shrink: true }} sx={inputStyles}
                    name="username" // 5. ADDED: name matches state key
                    value={formData.username} // 6. ADDED: value binds to state
                    onChange={handleChange} // 7. ADDED: onChange captures typing
                    required // 8. ADDED: required validation
                    InputProps={{
                      startAdornment: (<InputAdornment position="start"><PersonOutlineIcon sx={{ color: theme.palette.secondary.main, fontSize: 20 }} /></InputAdornment>),
                      sx: { pb: 0.5, fontWeight: 600, color: theme.palette.text.primary }
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField 
                    fullWidth variant="standard" label="E-mail" placeholder="user@gmail.com" InputLabelProps={{ shrink: true }} sx={inputStyles}
                    name="email"
                    type="email" // Ensures browser checks for valid email format
                    value={formData.email}
                    onChange={handleChange}
                    required
                    InputProps={{
                      startAdornment: (<InputAdornment position="start"><MailOutlineIcon sx={{ color: theme.palette.secondary.main, fontSize: 20 }} /></InputAdornment>),
                      sx: { pb: 0.5, fontWeight: 600, color: theme.palette.text.primary }
                    }}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    fullWidth variant="standard" type="password" label="Password" placeholder="••••••••" InputLabelProps={{ shrink: true }} sx={inputStyles}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    InputProps={{
                      startAdornment: (<InputAdornment position="start"><LockOutlinedIcon sx={{ color: theme.palette.secondary.main, fontSize: 20 }} /></InputAdornment>),
                      sx: { pb: 0.5, fontWeight: 600, color: theme.palette.text.primary, letterSpacing: 2 }
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField 
                    select fullWidth variant="standard" label="Role" InputLabelProps={{ shrink: true }} sx={inputStyles}
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (<InputAdornment position="start"><ManageAccountsOutlinedIcon sx={{ color: theme.palette.secondary.main, fontSize: 20 }} /></InputAdornment>),
                      sx: { pb: 0.5, fontWeight: 600, color: theme.palette.text.primary }
                    }}
                  >
                    <MenuItem value="CUSTOMER">Customer</MenuItem>
                    <MenuItem value="AGENT">Agent</MenuItem>
                  </TextField>
                </Grid>
              </Grid>
            </Stack>

            <FormControlLabel
              control={<Checkbox checked={agreed} onChange={(e) => setAgreed(e.target.checked)} size="small" sx={{ color: theme.palette.secondary.main, '&.Mui-checked': { color: theme.palette.secondary.main } }} />}
              label={<Typography sx={{ fontSize: '0.75rem', color: theme.palette.text.secondary }}>I agree to the <Link href="#" sx={{ color: theme.palette.primary.main, textDecoration: 'none', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}>Terms</Link> and <Link href="#" sx={{ color: theme.palette.primary.main, textDecoration: 'none', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}>Privacy Policy</Link></Typography>}
              sx={{ mb: 4, ml: -1 }}
            />

            <Box sx={{ mb: 4 }}>
              {/* 9. CHANGED: type="submit" so pressing Enter triggers the form */}
              <Button 
                type="submit"
                fullWidth
                variant="contained" 
                sx={{ 
                  bgcolor: theme.palette.secondary.main, borderRadius: '30px', py: 1.5, fontWeight: 800,
                  boxShadow: `0px 8px 20px ${theme.palette.secondary.main}50`, textTransform: 'none', fontSize: '1rem',
                  '&:hover': { bgcolor: theme.palette.secondary.dark, transform: 'translateY(-2px)', boxShadow: `0px 12px 25px ${theme.palette.secondary.main}60` },
                  transition: 'all 0.3s ease'
                }}
              >
                Sign up
              </Button>
            </Box>

            <Typography sx={{ fontSize: '0.85rem', color: theme.palette.text.secondary, fontWeight: 600, textAlign: 'center' }}>
              Already have an account? {' '}
              <Link component="button" onClick={() => navigate('/login')} sx={{ color: theme.palette.primary.main, textDecoration: 'none', fontWeight: 800, verticalAlign: 'baseline', fontSize: '0.85rem' }}>
                Log In
              </Link>
            </Typography>

          </Paper>
        </motion.div>
      </Box>
    </Box>
  );
};

export default Register;