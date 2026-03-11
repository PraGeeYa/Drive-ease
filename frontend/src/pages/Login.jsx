import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  InputBase, 
  Stack, 
  IconButton, 
  Paper, 
  Container, 
  Link,
  Checkbox,
  FormControlLabel,
  Grid
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { authService } from '../api/authService'; 
import Swal from 'sweetalert2'; // 🔥 Added SweetAlert2

// Icons
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Login = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  // State for Login Credentials
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  // Dynamic colors pulling directly from your custom theme
  const gradient = `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`;
  const iconColor = theme.palette.primary.main;
  const textColor = theme.palette.text.primary;
  const lightText = theme.palette.text.secondary;

  // Handle input typing
  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  // 🔥 Professional Alert Styles (Reusable)
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
  });

  // Handle Form Submission to Backend
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    
    if (!credentials.username || !credentials.password) {
      Toast.fire({
        icon: 'warning',
        title: 'Please enter both username and password'
      });
      return;
    }

    try {
      const response = await authService.loginUser(credentials);
      
      if (response.status === 200) {
        // 🔥 Success Popup
        Swal.fire({
          title: 'Welcome Back!',
          text: 'Login Successful',
          icon: 'success',
          showConfirmButton: false,
          timer: 2000,
          background: '#fff',
          color: '#1b2559',
          borderRadius: '25px',
          iconColor: theme.palette.primary.main,
        });

        setTimeout(() => {
          navigate('/'); 
        }, 2000);
      }
    } catch (error) {
      console.error("Login failed:", error);
      // 🔥 Error Popup
      Swal.fire({
        title: 'Login Failed',
        text: error.response?.data?.message || "Invalid username or password.",
        icon: 'error',
        confirmButtonColor: theme.palette.primary.main,
        borderRadius: '20px'
      });
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      width: '100vw',
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      bgcolor: theme.palette.background.default, 
      p: 2
    }}>
      
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <Paper component="form" onSubmit={handleSubmit} elevation={0} sx={{ 
            position: 'relative',
            width: '100%',
            minHeight: '550px',
            borderRadius: '30px',
            bgcolor: theme.palette.background.paper,
            boxShadow: '0px 20px 50px rgba(0, 0, 0, 0.08)',
            overflow: 'hidden',
            display: 'flex'
          }}>

            {/* --- SVG BACKGROUND WAVES --- */}
            <svg 
              width="100%" 
              height="100%" 
              viewBox="0 0 900 550" 
              preserveAspectRatio="none" 
              style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }}
            >
              <defs>
                <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={theme.palette.primary.main} />
                  <stop offset="100%" stopColor={theme.palette.secondary.main} />
                </linearGradient>
              </defs>
              <path d="M 350 0 C 450 150 700 50 900 250 L 900 0 Z" fill="url(#waveGradient)" />
              <path d="M 0 550 L 0 450 C 250 480 400 600 650 450 C 800 360 900 350 900 350 L 900 550 Z" fill="url(#waveGradient)" />
            </svg>

            {/* --- CONTENT GRID --- */}
            <Grid container sx={{ position: 'relative', zIndex: 1 }}>
              
              {/* LEFT SIDE: LOGIN FORM */}
              <Grid item xs={12} md={6} sx={{ 
                p: { xs: 4, md: 6 }, 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <Box sx={{ width: '100%', maxWidth: '350px' }}>
                  
                  <Typography variant="h4" sx={{ fontWeight: 900, color: textColor, textAlign: 'center', mb: 0.5 }}>
                    Hello!
                  </Typography>
                  <Typography variant="body2" sx={{ color: lightText, textAlign: 'center', mb: 5 }}>
                    Sign in to your account
                  </Typography>

                  <Stack spacing={3}>
                    
                    {/* Username Input */}
                    <Box sx={{ 
                      display: 'flex', alignItems: 'center', bgcolor: theme.palette.background.paper, 
                      borderRadius: '50px', px: 3, py: 1.5,
                      boxShadow: '0px 10px 25px rgba(0,0,0,0.06)',
                      border: '1px solid rgba(0,0,0,0.02)'
                    }}>
                      <PersonOutlineIcon sx={{ color: iconColor, mr: 2 }} />
                      <InputBase 
                        placeholder="Username" 
                        fullWidth 
                        sx={{ color: textColor, fontSize: '0.95rem' }}
                        name="username" 
                        value={credentials.username}
                        onChange={handleChange}
                        required
                      />
                    </Box>

                    {/* Password Input */}
                    <Box sx={{ 
                      display: 'flex', alignItems: 'center', bgcolor: theme.palette.background.paper, 
                      borderRadius: '50px', pl: 3, pr: 2, py: 1,
                      boxShadow: '0px 10px 25px rgba(0,0,0,0.06)',
                      border: '1px solid rgba(0,0,0,0.02)'
                    }}>
                      <LockOutlinedIcon sx={{ color: iconColor, mr: 2 }} />
                      <InputBase 
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password" 
                        fullWidth 
                        sx={{ color: textColor, fontSize: '0.95rem' }}
                        name="password" 
                        value={credentials.password}
                        onChange={handleChange}
                        required
                      />
                      <IconButton onClick={() => setShowPassword(!showPassword)} sx={{ color: iconColor }}>
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </Box>

                    {/* Options Row */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 1 }}>
                      <FormControlLabel
                        control={<Checkbox size="small" sx={{ color: iconColor, '&.Mui-checked': { color: iconColor } }} />}
                        label={<Typography sx={{ fontSize: '0.8rem', color: lightText, fontWeight: 600 }}>Remember me</Typography>}
                      />
                      <Link href="#" sx={{ fontSize: '0.8rem', color: lightText, fontWeight: 600, textDecoration: 'none', '&:hover': { color: iconColor } }}>
                        Forgot password?
                      </Link>
                    </Box>

                    {/* Sign In Button */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', pt: 2, pb: 4 }}>
                      <Button 
                        type="submit" 
                        variant="contained" 
                        sx={{ 
                          background: gradient,
                          borderRadius: '50px',
                          px: 8,
                          py: 1.5,
                          fontWeight: 800,
                          boxShadow: `0px 10px 20px ${theme.palette.primary.main}40`,
                          transition: 'transform 0.2s',
                          '&:hover': { transform: 'scale(1.05)', boxShadow: `0px 12px 25px ${theme.palette.primary.main}60` }
                        }}
                      >
                        SIGN IN
                      </Button>
                    </Box>

                    {/* Create Account Link */}
                    <Typography textAlign="center" sx={{ fontSize: '0.85rem', color: lightText }}>
                      Don't have an account? {' '}
                      <Link 
                        component="button"
                        onClick={() => navigate('/register')}
                        sx={{ color: iconColor, textDecoration: 'none', fontWeight: 800, verticalAlign: 'baseline', fontSize: '0.85rem' }}
                      >
                        Create
                      </Link>
                    </Typography>

                  </Stack>
                </Box>
              </Grid>

              {/* RIGHT SIDE: TEXT AREA */}
              <Grid item xs={12} md={6} sx={{ 
                p: { xs: 4, md: 6 }, 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <Box sx={{ maxWidth: '350px', textAlign: 'center' }}>
                  <Typography variant="h3" sx={{ fontWeight: 900, color: textColor, mb: 3 }}>
                    Welcome Back!
                  </Typography>
                  <Typography sx={{ color: lightText, lineHeight: 1.8, fontSize: '1rem' }}>
                    Experience the ultimate comfort and performance. Sign in to seamlessly manage your premium bookings.
                  </Typography>
                </Box>
              </Grid>

            </Grid>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Login;