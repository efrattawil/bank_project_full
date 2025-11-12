import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Snackbar,
  Slide
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import FutureBankLogo from '../components/FutureBankLogo';
import authService from '../services/authService';
import FooterSmall from '../components/FooterSmall';

function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      await authService.signup(email, password, phoneNumber);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 4000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage:
          'linear-gradient(rgba(0,45,98,0.7), rgba(0,45,98,0.7)), url("/images/futurebank-bg.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        py: 8,
      }}
    >
      <Container maxWidth="xs">
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
            <FutureBankLogo size={60} compact/>
          </Box>

          <PersonAddIcon color="primary" sx={{ fontSize: 50, mb: 1.5 }} />

          <Typography
            component="h1"
            variant="h5"
            color="primary.main"
            sx={{ mb: 3, fontWeight: 'bold' }}
          >
            Create Account
          </Typography>

          {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email (for verification)"
              autoFocus
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password (min 8 chars)"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Phone Number"
              type="tel"
              variant="outlined"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                backgroundColor: '#002D62',
                '&:hover': { backgroundColor: '#001F44', transform: 'scale(1.03)' },
                py: 1.5,
                fontWeight: 700,
                borderRadius: 2,
                transition: 'all 0.3s',
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
            </Button>

            <Typography variant="body2" align="center">
              Already have an account?{' '}
              <RouterLink
                to="/login"
                style={{
                  color: '#00AEEF',
                  textDecoration: 'none',
                  fontWeight: 600,
                }}
              >
                Sign In
              </RouterLink>
            </Typography>
          </Box>
        </Paper>

        {/* Snackbar for Success */}
        <Snackbar
          open={success}
          onClose={() => setSuccess(false)}
          autoHideDuration={4000}
          TransitionComponent={SlideTransition}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity="success" sx={{ width: '100%', fontWeight: 'bold' }}>
            Registration successful! Redirecting to login...
          </Alert>
        </Snackbar>
      </Container>

      {/* FooterSmall */}
      <Box sx={{ mt: 'auto', width: '100%' }}>
        <FooterSmall />
      </Box>
    </Box>
  );
};

export default SignupPage;
