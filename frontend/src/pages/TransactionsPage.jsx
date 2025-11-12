import React, { useState, useEffect } from 'react';
import { Box, Container, Paper, Typography, TextField, Button, CircularProgress, Alert, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';
import FutureBankLogo from '../components/FutureBankLogo';
import Footer from '../components/Footer';

const SOCKET_URL = "http://localhost:5000";
const socket = io(SOCKET_URL, { autoConnect: false });

const TransactionsPage = () => {
  const navigate = useNavigate();
  const [recipientEmail, setRecipientEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [currentBalance, setCurrentBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');
  const [incomingNotification, setIncomingNotification] = useState('');

  const fetchDashboardAndConnectSocket = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You are not logged in');
      return;
    }

    try {
      const res = await axios.get('http://localhost:5000/bank_app/api/v1/dashboard', {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` }
      });
      setCurrentBalance(parseFloat(res.data.balance));

      if (!socket.connected) socket.connect();
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.userId;
      socket.emit('registerUser', userId);

      socket.on('transfer-success', ({ to, amount }) => {
        setSuccess(true);
        setMessage(`Successfully transferred $${amount} to ${to}`);
        });

      socket.on('money-transfer', ({ from, amount }) => {
        setIncomingNotification(`New transaction from ${from}: $${amount}`);
        setCurrentBalance(prev => prev + parseFloat(amount));
      });

    } catch (err) {
      console.error('Error fetching dashboard:', err);
      setError(err.response?.data?.message || 'Failed to fetch balance');
    }
  };

  useEffect(() => {
    fetchDashboardAndConnectSocket();

    return () => {
      socket.off('money-transfer');
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token'); 
      if (!token) {
        setError('You are not logged in');
        setLoading(false);
        return;
      }

      const res = await axios.post(
        'http://localhost:5000/bank_app/api/v1/transactions',
        { recipientEmail, amount },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        }
      );

      setCurrentBalance(parseFloat(res.data.newBalance));
      setRecipientEmail('');
      setAmount('');
      setSuccess(true);

      setTimeout(() => navigate('/dashboard'), 3000);

    } catch (err) {
      console.error('Transfer error:', err);
      setError(err.response?.data?.message || 'Transfer failed');
    }
    setLoading(false);
  };

  const handleCloseSuccess = () => setSuccess(false);
  const handleCloseIncoming = () => setIncomingNotification('');

  return (
    <Box sx={{ minHeight: '100vh', backgroundImage: 'linear-gradient(rgba(0,45,98,0.7), rgba(0,45,98,0.7)), url("/images/futurebank-bg.jpg")', backgroundSize: 'cover', backgroundPosition: 'center', py: 6, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <Container maxWidth="sm">
        <Paper elevation={8} sx={{ p: 5, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(6px)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <FutureBankLogo size={60} compact />
          </Box>

          <Typography variant="h4" align="center" sx={{ fontWeight: 700, color: '#002D62', mb: 3 }}>
            Transfer Funds
          </Typography>

          {currentBalance !== null && (
            <Typography align="center" sx={{ mb: 3, fontWeight: 600, color: '#00AEEF' }}>
              Your Current Balance: ${currentBalance.toFixed(2)}
            </Typography>
          )}

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField label="Recipient Email" fullWidth margin="normal" value={recipientEmail} onChange={(e) => setRecipientEmail(e.target.value)} required disabled={loading} />
            <TextField label="Amount ($)" fullWidth margin="normal" type="number" inputProps={{ step: "0.01" }} value={amount} onChange={(e) => setAmount(e.target.value)} required disabled={loading} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mt: 3 }}>
              <Button variant="outlined" onClick={() => navigate('/dashboard')} disabled={loading}>← Back</Button>
              <Button type="submit" variant="contained" disabled={loading}>{loading ? <CircularProgress size={24} /> : 'Send'}</Button>
            </Box>
          </Box>
        </Paper>
      </Container>

      <Footer />

      {/* Snackbar עבור העברה מוצלחת */}
        <Snackbar 
        open={success} 
        autoHideDuration={1500} 
        onClose={handleCloseSuccess} 
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
        <Alert 
            onClose={handleCloseSuccess} 
            severity="success"
            sx={{
            width: '350px',
            backgroundColor: '#00AEEF',      // צבע מותאם לעיצוב האתר
            color: '#fff',                    // טקסט לבן
            fontWeight: 600,
            borderRadius: 2,
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            textAlign: 'center',
            '& .MuiAlert-icon': { color: '#fff' }, // צבע האייקון
            }}
        >
            Funds transferred successfully!
        </Alert>
        </Snackbar>


      {/* Snackbar עבור הודעה בזמן אמת */}
        <Snackbar 
            open={!!incomingNotification} 
            autoHideDuration={4000} 
            onClose={handleCloseIncoming} 
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
            <Alert 
                onClose={handleCloseIncoming} 
                severity="info"
                sx={{
                width: '350px',
                backgroundColor: 'rgba(0, 45, 98, 0.9)', // כחול כהה מותאם
                color: '#fff',
                fontWeight: 500,
                borderRadius: 2,
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                textAlign: 'center',
                '& .MuiAlert-icon': { color: '#fff' },
                }}
            >
                {incomingNotification}
            </Alert>
        </Snackbar>

    </Box>
  );
};

export default TransactionsPage;
