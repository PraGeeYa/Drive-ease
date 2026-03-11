import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material'; 
import Header from './components/Header';
import Footer from './components/Footer';
import Preloader from './components/Preloader';

// Pages
import Home from './pages/Home';
import AboutUs from './pages/AboutUs'; 
import Contact from './pages/Contact'; 
import Login from './pages/Login';
import Register from './pages/Register';
import AgentDashboard from './pages/AgentDashboard';
import FleetManagement from './pages/FleetManagement';
import BookingHistory from './pages/BookingHistory';
import Favorites from './pages/Favorites';
import AgentProfile from './pages/AgentProfile'; 
import FleetPortal from './pages/FleetPortal'; 
import CustomerDashboard from './pages/CustomerDashboard';
import CustomerProfile from './pages/CustomerProfile';
import AdminDashboard from './pages/AdminDashboard'; 

// --- Helper to fix scroll position ---
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// --- Layout Wrapper ---
const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  

  const hideLayoutPages = ['/login', '/register']; 
  const shouldHide = hideLayoutPages.includes(location.pathname);

  return (
    <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        width: '100vw', 
        maxWidth: '100%',
        overflowX: 'hidden' 
    }}>
      {!shouldHide && <Header />}

      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
        
          pt: !shouldHide ? { xs: 8, md: 9 } : 0 
        }}
      >
        {children}
      </Box>

      {!shouldHide && <Footer />}
    </Box>
  );
};

function App() {
  const [isAppLoading, setIsAppLoading] = useState(true);

  return (
    <>
      <CssBaseline /> 
      
      {isAppLoading ? (
        <Preloader onFinished={() => setIsAppLoading(false)} />
      ) : (
        <Router>
          <ScrollToTop />
          <LayoutWrapper>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/contact" element={<Contact />} /> {/* 🔥 Added Contact Us Route */}
              
              <Route path="/fleet-portal" element={<FleetPortal />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Agent Portal Routes */}
              <Route path="/agent-dashboard" element={<AgentDashboard />} />
              <Route path="/fleet-management" element={<FleetManagement />} />
              <Route path="/booking-history" element={<BookingHistory />} />
              <Route path="/favorites" element={<Favorites />} /> 
              <Route path="/settings" element={<AgentProfile />} /> 

              {/* Customer Dashboard Routes */}
              <Route path="/customer-dashboard" element={<CustomerDashboard />} /> 
              <Route path="/customer-profile" element={<CustomerProfile />} />
              
              {/* Super Admin Dashboard Route */}
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </LayoutWrapper>
        </Router>
      )}
    </>
  );
}

export default App;