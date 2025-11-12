// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Container, Typography, Button, Box, Paper, Fade, Tooltip 
} from '@mui/material';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import SecurityIcon from '@mui/icons-material/Security';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import EmojiNatureIcon from '@mui/icons-material/EmojiNature';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import axios from 'axios';
import FutureBankLogo from '../components/FutureBankLogo';
import Footer from '../components/Footer';

const HomePage = () => {
  const [connected, setConnected] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const backendRootUrl = 'http://localhost:5000/';
    axios.get(backendRootUrl)
      .then(res => {
        if (res.status === 200) setConnected(true);
      })
      .catch(() => setConnected(false));
    
    const timer = setTimeout(() => setLoaded(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundImage: 'url("/images/futurebank-bg.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.35)',
          backdropFilter: 'blur(2px)',
          zIndex: 0,
        },
      }}
    >
      <Container
        maxWidth="md"
        sx={{
          flexGrow: 1,
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 10,
        }}
      >
        {/* Entrance animation */}
        <Fade in={loaded} timeout={1000}>
          <Paper
            elevation={10}
            sx={{
              p: { xs: 4, md: 8 },
              borderRadius: 4,
              textAlign: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(8px)',
              width: '100%',
              maxWidth: 800,
              minHeight: 420,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
              <FutureBankLogo size={120} compact/>
            </Box>

            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#002D62' }}>
              Welcome to the Future of Banking
            </Typography>

            <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary', maxWidth: 500 }}>
              Smart. Secure. Sustainable. Log in or open your account today.
            </Typography>

            {/* CTA Buttons */}
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                gap: 2,
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'center',
              }}
            >
              <Button
                component={RouterLink}
                to="/login"
                variant="contained"
                fullWidth
                size="large"
                startIcon={<LockOpenIcon />}
                sx={{
                  backgroundColor: '#002D62',
                  '&:hover': { 
                    backgroundColor: '#001A44',
                    transform: 'scale(1.03)',
                    boxShadow: 3,
                  },
                  py: 1.4,
                  fontWeight: 'bold',
                  transition: 'all 0.3s',
                }}
              >
                Login
              </Button>

              <Button
                component={RouterLink}
                to="/signup"
                variant="outlined"
                fullWidth
                size="large"
                startIcon={<AccountBalanceIcon />}
                sx={{
                  borderColor: '#00AEEF',
                  color: '#00AEEF',
                  '&:hover': {
                    backgroundColor: 'rgba(0,174,239,0.08)',
                    borderColor: '#0098CF',
                    transform: 'scale(1.03)',
                  },
                  py: 1.4,
                  fontWeight: 'bold',
                  transition: 'all 0.3s',
                }}
              >
                Register
              </Button>
            </Box>
          </Paper>
        </Fade>

        {/* Feature Cards */}
        <Box
          sx={{
            mt: { xs: 6, md: 10 },
            mb: 8,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 3,
              maxWidth: 1000,
            }}
          >
            <Paper
              elevation={6}
              sx={{
                flex: '1 1 250px',
                p: 3,
                textAlign: 'center',
                borderRadius: 3,
                backgroundColor: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(6px)',
                transition: 'all 0.3s',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 },
              }}
            >
              <SecurityIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                Secure Banking
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                Advanced encryption and protection for your peace of mind.
              </Typography>
            </Paper>

            <Paper
              elevation={6}
              sx={{
                flex: '1 1 250px',
                p: 3,
                textAlign: 'center',
                borderRadius: 3,
                backgroundColor: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(6px)',
                transition: 'all 0.3s',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 },
              }}
            >
              <LightbulbIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                Smart Solutions
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                Tools and insights to grow your savings efficiently.
              </Typography>
            </Paper>

            <Paper
              elevation={6}
              sx={{
                flex: '1 1 250px',
                p: 3,
                textAlign: 'center',
                borderRadius: 3,
                backgroundColor: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(6px)',
                transition: 'all 0.3s',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 },
              }}
            >
              <EmojiNatureIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                Sustainable Future
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                Investing in green and ethical financial initiatives.
              </Typography>
            </Paper>
          </Box>
        </Box>
      </Container>

      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default HomePage;
