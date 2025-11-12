import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Box, Paper, Button, CircularProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid, Snackbar, Alert
} from '@mui/material';
import FutureBankLogo from '../components/FutureBankLogo';
import api from '../services/api';
import authService from '../services/authService';
import Footer from '../components/Footer';
import socket from '../services/socket';

const DashboardPage = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ hasPrevPage: false, hasNextPage: false, totalPages: 1, currentPage: 1 });
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifMessage, setNotifMessage] = useState('');

  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  // --- Fetch dashboard data ---
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/dashboard`, {
        params: { page },
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data;
      setBalance(parseFloat(data.balance) || 0);
      setTransactions(data.latestTransactions || []);
      setUserEmail(data.userEmail || 'User');
      setPagination(data.pagination);
    } catch (err) {
      console.error('Dashboard load failed:', err);
      authService.logout();
      setError('Session expired or failed to load data. Please log in again.');
      navigate('/login');
    } finally {
      setLoading(false);
    }
  }, [page, token, navigate]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // --- Socket.IO for real-time updates ---
  useEffect(() => {
    if (!userId || !token) return;

    socket.auth = { token };
    if (!socket.connected) socket.connect();

    socket.emit("registerUser", userId);

    const handleMoneyTransfer = (data) => {
      setNotifMessage(`You received $${data.amount} from ${data.from}`);
      setNotifOpen(true);
      setBalance(prev => prev + parseFloat(data.amount));
      setTransactions(prev => [{
        _id: new Date().getTime(),
        type: "TRANSFER_IN",
        amount: parseFloat(data.amount).toFixed(2),
        date: new Date().toISOString(),
        relatedUserEmail: data.from
      }, ...prev]);
    };

    socket.on("money-received", handleMoneyTransfer);

    return () => {
      socket.off("money-received", handleMoneyTransfer);
    };
  }, [userId, token]);

  const handleNextPage = () => setPage(prev => prev + 1);
  const handlePrevPage = () => setPage(prev => Math.max(1, prev - 1));
  const handleSignout = () => {
    authService.logout();
    navigate('/');
  };
  const handleNotifClose = () => setNotifOpen(false);

  if (loading && transactions.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading bank data...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundImage: 'linear-gradient(rgba(255,255,255,0.8), rgba(255,255,255,0.8)), url("/images/futurebank-bg.jpg")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <Container component="main" maxWidth="lg" sx={{ flexGrow: 1, py: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <FutureBankLogo size={60} compact />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="contained" onClick={() => navigate('/transactions')} sx={{ backgroundColor: '#002D62', '&:hover': { backgroundColor: '#001F44' }, color: 'white', fontWeight: 700, borderRadius: 2 }}>Transfer Funds</Button>
            <Button variant="contained" onClick={handleSignout} sx={{ backgroundColor: '#555555', '&:hover': { backgroundColor: '#333333' }, color: 'white', fontWeight: 700, borderRadius: 2 }}>Sign Out</Button>
          </Box>
        </Box>

        {/* Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6}>
            <Paper elevation={6} sx={{ p: 3, borderRadius: 3, backgroundColor: 'rgba(0, 45, 98, 0.85)', color: '#fff', height: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography variant="subtitle1" sx={{ opacity: 0.8 }}>Hello,</Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{userEmail}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper elevation={6} sx={{ p: 3, borderRadius: 3, backgroundColor: 'rgba(0, 174, 239, 0.85)', color: '#fff', height: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography variant="subtitle1" sx={{ opacity: 0.8 }}>Current Balance</Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 1 }}>${balance.toFixed(2)}</Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Transactions Table */}
        <Paper elevation={6} sx={{ p: 3, mb: 4, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.95)' }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', borderBottom: '2px solid #002D62', pb: 1, mb: 2, color: '#002D62' }}>
            Transaction History
          </Typography>

          {transactions.length === 0 ? (
            <Typography>No transactions found for this page.</Typography>
          ) : (
            <TableContainer sx={{ borderRadius: 2, overflow: 'hidden' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#002D62' }}>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Date</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }} align="center">Amount</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }} align="right">Recipient / Sender</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.map(t => {
                    const isOutgoing = t.type.includes('OUT');
                    return (
                      <TableRow key={t._id} hover sx={{ '&:hover': { backgroundColor: 'rgba(0,45,98,0.05)' } }}>
                        <TableCell>{t.date !== 'N/A' ? new Date(t.date).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit' }) : '-'}</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 700, color: isOutgoing ? 'error.main' : 'success.main' }}>${t.amount}</TableCell>
                        <TableCell align="right">{isOutgoing ? `To: ${t.relatedUserEmail}` : `From: ${t.relatedUserEmail}`}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, alignItems: 'center' }}>
            <Button variant="outlined" onClick={handlePrevPage} disabled={!pagination.hasPrevPage} sx={{ color: '#002D62', borderColor: '#002D62', '&:hover': { backgroundColor: 'rgba(0,45,98,0.08)', borderColor: '#002D62' } }}>&larr; Previous</Button>
            <Typography sx={{ fontWeight: 500 }}>Page {pagination.currentPage} of {pagination.totalPages}</Typography>
            <Button variant="outlined" onClick={handleNextPage} disabled={!pagination.hasNextPage} sx={{ color: '#002D62', borderColor: '#002D62', '&:hover': { backgroundColor: 'rgba(0,45,98,0.08)', borderColor: '#002D62' } }}>Next &rarr;</Button>
          </Box>
        </Paper>
      </Container>

      <Footer />

      <Snackbar open={notifOpen} autoHideDuration={5000} onClose={handleNotifClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleNotifClose} severity="info" sx={{ width: '100%' }}>{notifMessage}</Alert>
      </Snackbar>
    </Box>
  );
};

export default DashboardPage;
