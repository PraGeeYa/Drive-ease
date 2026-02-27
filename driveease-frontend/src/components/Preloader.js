import React, { useState, useEffect } from 'react';
import { Box, Typography, LinearProgress, Stack } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

// Oya dapu aluth images tika mekata add kala
const images = [
    "https://cmg-cmg-rd-20056-prod.cdn.arcpublishing.com/resizer/v2/https%3A%2F%2Fcloudfront-us-east-1.images.arcpublishing.com%2Fcmg%2F6ODU3HAMKYMC77HKMBFFB5O37M.jpg?auth=294b5f28f5435a473cafa45d49bfe0018fa737ce1b96e49ead232e6ed07827ac&width=1200&height=630&smart=true",
    "https://www.luxuryfleet.com.au/wp-content/uploads/2020/01/Luxury-Fleet-Bentley-Continental-GT-V8-Convertible-1.jpg",
    
];

const loadingTexts = [
    "INITIALIZING SECURE GATEWAY...",
    "SYNCING PREMIUM FLEET...",
    "AUTHENTICATING AGENT PROTOCOLS...",
    "ESTABLISHING ELITE ACCESS...",
    "READY TO DRIVE."
];

const Preloader = ({ onFinished }) => {
    const [progress, setProgress] = useState(0);
    const [currentImg, setCurrentImg] = useState(0);
    const [textIndex, setTextIndex] = useState(0);
    const PRIMARY_ORANGE = "#ff5722"; 

    // Progress bar logic
    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((oldProgress) => {
                if (oldProgress === 100) {
                    clearInterval(timer);
                    setTimeout(onFinished, 1500); 
                    return 100;
                }
                const diff = Math.random() * 12;
                const newProgress = Math.min(oldProgress + diff, 100);
                const nextIndex = Math.floor((newProgress / 100) * (loadingTexts.length - 1));
                setTextIndex(nextIndex);
                return newProgress;
            });
        }, 200);
        return () => clearInterval(timer);
    }, [onFinished]);

    // Image Slider logic
    useEffect(() => {
        const imgTimer = setInterval(() => {
            setCurrentImg((prev) => (prev + 1) % images.length);
        }, 3000); 
        return () => clearInterval(imgTimer);
    }, []);

    return (
        <Box sx={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            bgcolor: '#000', color: '#fff', zIndex: 9999,
            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
            overflow: 'hidden'
        }}>
            
            {/* --- 1. MOVING BACKGROUND SLIDER (Ken Burns Effect) --- */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentImg}
                    initial={{ opacity: 0, scale: 1.3, x: -30 }} // Zoom wela move wenna patan gannawa
                    animate={{ opacity: 0.3, scale: 1, x: 0 }} // Lassanata center wenawa
                    exit={{ opacity: 0, scale: 0.8, x: 30 }}
                    transition={{ duration: 3, ease: "linear" }}
                    style={{
                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                        backgroundImage: `url(${images[currentImg]})`,
                        backgroundSize: 'cover', backgroundPosition: 'center',
                        zIndex: -1, filter: 'grayscale(0.5) contrast(1.1)' 
                    }}
                />
            </AnimatePresence>

            <Box sx={{ 
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                background: 'radial-gradient(circle, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.9) 100%)',
                zIndex: 0
            }} />

            {/* --- 2. CENTER CONTENT --- */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                style={{ textAlign: 'center', zIndex: 10 }}
            >
                <Typography variant="overline" sx={{ color: PRIMARY_ORANGE, letterSpacing: 8, fontWeight: 900, mb: 1, display: 'block', opacity: 0.8 }}>
                    DRIVEEASE NETWORK
                </Typography>

                <Typography variant="h1" sx={{ 
                    fontWeight: 900, fontSize: { xs: '3.5rem', md: '6rem' }, 
                    mb: 1, letterSpacing: -2, lineHeight: 1,
                    textShadow: '0 0 40px rgba(0,0,0,0.5)'
                }}>
                    DRIVE<span style={{ color: PRIMARY_ORANGE }}>EASE</span>
                </Typography>

                {/* --- DYNAMIC LOADING TEXT --- */}
                <Box sx={{ height: '24px', mb: 6 }}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={textIndex}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Typography variant="caption" sx={{ color: PRIMARY_ORANGE, letterSpacing: 4, fontWeight: 700 }}>
                                {loadingTexts[textIndex]}
                            </Typography>
                        </motion.div>
                    </AnimatePresence>
                </Box>

                {/* --- 3. PROGRESS BAR --- */}
                <Box sx={{ width: { xs: 280, sm: 400 }, mx: 'auto', position: 'relative' }}>
                    <LinearProgress 
                        variant="determinate" 
                        value={progress} 
                        sx={{
                            height: 2, bgcolor: 'rgba(255,255,255,0.05)',
                            '& .MuiLinearProgress-bar': { 
                                bgcolor: PRIMARY_ORANGE,
                                boxShadow: `0 0 25px ${PRIMARY_ORANGE}` 
                            }
                        }}
                    />
                    
                    <Stack direction="row" justifyContent="space-between" mt={2}>
                        <Typography variant="h4" sx={{ fontWeight: 900, fontFamily: 'monospace', color: '#fff' }}>
                            {Math.round(progress)}<span style={{fontSize: '1rem', color: PRIMARY_ORANGE}}>%</span>
                        </Typography>
                        <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="caption" sx={{ display: 'block', letterSpacing: 2, fontWeight: 900, opacity: 0.4 }}>
                                ESTABLISHED
                            </Typography>
                            <Typography variant="caption" sx={{ letterSpacing: 2, fontWeight: 900, color: PRIMARY_ORANGE }}>
                                2026
                            </Typography>
                        </Box>
                    </Stack>
                </Box>
            </motion.div>

            {/* Bottom Status Bar */}
            <Stack 
                direction="row" 
                spacing={3} 
                sx={{ position: 'absolute', bottom: 40, opacity: 0.3, width: '100%', justifyContent: 'center' }}
            >
                <Typography variant="caption" sx={{ letterSpacing: 5, fontWeight: 900 }}>LUXURY</Typography>
                <Typography variant="caption" sx={{ letterSpacing: 5, fontWeight: 900 }}>•</Typography>
                <Typography variant="caption" sx={{ letterSpacing: 5, fontWeight: 900 }}>RELIABILITY</Typography>
                <Typography variant="caption" sx={{ letterSpacing: 5, fontWeight: 900 }}>•</Typography>
                <Typography variant="caption" sx={{ letterSpacing: 5, fontWeight: 900 }}>SRI LANKA</Typography>
            </Stack>
        </Box>
    );
};

export default Preloader;