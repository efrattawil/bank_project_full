import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { 
  Container, Typography, Box, TextField, Button, CircularProgress, Alert, Paper, Snackbar, Slide 
} from '@mui/material';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import FutureBankLogo from '../components/FutureBankLogo';
import { useAuth } from '../context/AuthContext';
import FooterSmall from '../components/FooterSmall';

function SlideTransition(props) {
  return <Slide {...props} direction="down" />;
}

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);
    setLoading(true);

    try {
        const res = await login(username, password); 
        localStorage.setItem('token', res.token); 
        navigate('/dashboard');
    } catch (err) {
        const msg = err.response?.data?.message || 'Login failed. Check username and password.';
        setErrorMessage(msg);
        setError(true);
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
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundImage: 'linear-gradient(rgba(0,45,98,0.7), rgba(0,45,98,0.7)), url("/images/futurebank-bg.jpg")',
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

          <LockOpenIcon color="primary" sx={{ fontSize: 50, mb: 1.5 }} />

          <Typography
            component="h1"
            variant="h5"
            color="primary.main"
            sx={{ mb: 3, fontWeight: 'bold' }}
          >
            Sign In
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
            <TextField
              name="username"
              margin="normal"
              required
              fullWidth
              label="Username"
              autoFocus
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
            <TextField
              name="password"
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password" 
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
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
            </Button>

            <Typography variant="body2" align="center">
              Don't have an account?{' '}
              <RouterLink to="/signup" style={{ color: '#00AEEF', textDecoration: 'none', fontWeight: 600 }}>
                Register here
              </RouterLink>
            </Typography>
          </Box>
        </Paper>

        {/* Snackbar for Error */}
        <Snackbar
          open={error}
          onClose={() => setError(false)}
          autoHideDuration={4000}
          TransitionComponent={SlideTransition}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity="error" sx={{ width: '100%', fontWeight: 'bold' }}>
            {errorMessage}
          </Alert>
        </Snackbar>
      </Container>
        <Box sx={{ mt: 'auto', width: '100%' }}>
        <FooterSmall />
        </Box>
    </Box>
  );
};

export default LoginPage;
