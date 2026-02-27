import React, { useState } from 'react'; 
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Preloader from './components/Preloader'; 
import Home from './pages/Home'; 
import Login from './pages/Login';
import Signup from './pages/Signup'; 
import Contact from './pages/Contact'; 
import About from './pages/About'; 
import Fleet from './pages/Fleet'; // Aluthin hadapu Fleet page eka import kala
import AgentDashboard from './pages/AgentDashboard'; 
import AgentRequests from './pages/AgentRequests';
import AgentInventory from './pages/AgentInventory'; 
import CustomerView from './pages/CustomerView'; 
import MyBookings from './pages/MyBookings'; 
import AdminDashboard from './pages/AdminDashboard';

/**
 * ProtectedRoute Component
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
    const role = localStorage.getItem('role');
    const isAuthenticated = localStorage.getItem('userId');

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        return <Navigate to="/login" />; 
    }

    return children;
};

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading ? (
        <Preloader onFinished={() => setLoading(false)} />
      ) : (
        <Router>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar /> 
            
            <Box sx={{ flex: 1 }}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} /> 
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} /> 
                <Route path="/contact" element={<Contact />} />
                <Route path="/about" element={<About />} /> 
                <Route path="/fleet" element={<Fleet />} /> {/* Fleet Route eka add kala */}
                <Route path="/search-results" element={<CustomerView />} />

                {/* Protected Routes */}
                <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
                <Route path="/agent-dashboard" element={<ProtectedRoute allowedRoles={['AGENT']}><AgentDashboard /></ProtectedRoute>} />
                <Route path="/agent-inventory" element={<ProtectedRoute allowedRoles={['AGENT']}><AgentInventory /></ProtectedRoute>} />
                <Route path="/agent-requests" element={<ProtectedRoute allowedRoles={['AGENT']}><AgentRequests /></ProtectedRoute>} />
                <Route path="/my-bookings" element={<ProtectedRoute allowedRoles={['CUSTOMER']}><MyBookings /></ProtectedRoute>} />

                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Box>

            <Footer />
          </Box>
        </Router>
      )}
    </>
  );
}

export default App;