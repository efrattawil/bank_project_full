// src/pages/ComingSoonPage.jsx
import React from 'react';
import { Container, Box, Typography, Button, Paper } from '@mui/material';
import FutureBankLogo from '../components/FutureBankLogo';
import { useNavigate } from 'react-router-dom';

const ComingSoonPage = ({ title }) => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: 'linear-gradient(rgba(0,45,98,0.7), rgba(0,45,98,0.7)), url("/images/futurebank-bg.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        py: 8,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={12}
          sx={{
            p: 5,
            borderRadius: 3,
            textAlign: 'center',
            backgroundColor: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(6px)',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <FutureBankLogo size={60} compact />
          </Box>

          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, color: '#002D62' }}>
            {title}
          </Typography>

          <Typography variant="body1" sx={{ mb: 3 }}>
            This page is currently under construction. Please check back later.
          </Typography>

          <Button
            variant="contained"
            sx={{
              backgroundColor: '#002D62',
              '&:hover': { backgroundColor: '#001F44', transform: 'scale(1.03)' },
              py: 1.5,
              px: 4,
              fontWeight: 700,
              borderRadius: 2,
              transition: 'all 0.3s',
            }}
            onClick={() => navigate('/')}
          >
            Go Back Home
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default ComingSoonPage;
