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
import Fleet from './pages/Fleet'; 
import AgentDashboard from './pages/AgentDashboard'; 
import AgentRequests from './pages/AgentRequests';
import AgentInventory from './pages/AgentInventory'; 
import CustomerView from './pages/CustomerView'; 
import MyBookings from './pages/MyBookings'; 
import AdminDashboard from './pages/AdminDashboard';

/**
 * ProtectedRoute Component
 * This is a security wrapper that checks if a user is logged in
 * and if they have the correct permissions (Role) to view a specific page.
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
    // Retrieving login data from Browser's LocalStorage
    const role = localStorage.getItem('role');
    const isAuthenticated = localStorage.getItem('userId');

    // If not logged in, redirect to the Login page
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    // If logged in but doesn't have the required role, redirect to Login
    if (allowedRoles && !allowedRoles.includes(role)) {
        return <Navigate to="/login" />; 
    }

    // If everything is correct, render the requested page
    return children;
};

function App() {
  // State to manage the initial loading screen (Preloader)
  const [loading, setLoading] = useState(true);

  return (
    <>
      {/* Show Preloader until the app is ready */}
      {loading ? (
        <Preloader onFinished={() => setLoading(false)} />
      ) : (
        <Router>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar /> 
            
            {/* Main Content Area */}
            <Box sx={{ flex: 1 }}>
              <Routes>
                {/* PUBLIC ROUTES: Anyone can visit these pages */}
                <Route path="/" element={<Home />} /> 
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} /> 
                <Route path="/contact" element={<Contact />} />
                <Route path="/about" element={<About />} /> 
                <Route path="/fleet" element={<Fleet />} /> 
                <Route path="/search-results" element={<CustomerView />} />

                {/* PROTECTED ROUTES: Only specific users can enter */}
                
                {/* Admin Only */}
                <Route path="/admin" element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                        <AdminDashboard />
                    </ProtectedRoute>
                } />

                {/* Agent Only */}
                <Route path="/agent-dashboard" element={
                    <ProtectedRoute allowedRoles={['AGENT']}>
                        <AgentDashboard />
                    </ProtectedRoute>
                } />
                <Route path="/agent-inventory" element={
                    <ProtectedRoute allowedRoles={['AGENT']}>
                        <AgentInventory />
                    </ProtectedRoute>
                } />
                <Route path="/agent-requests" element={
                    <ProtectedRoute allowedRoles={['AGENT']}>
                        <AgentRequests />
                    </ProtectedRoute>
                } />

                {/* Customer Only */}
                <Route path="/my-bookings" element={
                    <ProtectedRoute allowedRoles={['CUSTOMER']}>
                        <MyBookings />
                    </ProtectedRoute>
                } />

                {/* 404 Redirect: Any invalid URL will go back to Home */}
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