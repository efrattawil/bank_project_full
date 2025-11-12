import React from 'react';
import { Box, Typography, Grid, Link } from '@mui/material';
import FutureBankLogo from './FutureBankLogo';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#002D62',
        color: '#FFFFFF',
        py: 6,
        mt: 'auto',
        width: '100%', 
        zIndex: 10,
      }}
    >
      {/* Grid ברוחב מלא */}
      <Grid container spacing={4} sx={{ maxWidth: '100%', px: 4 }} justifyContent="flex-start">
        <Grid item xs={12} md={4}>
          <FutureBankLogo size={50} color="#FFFFFF" />
          <Typography variant="body2" color="backgroundColor: '#002D62'" sx={{ mt: 1 }}>
            Smart. Secure. Sustainable. Banking solutions for your future.
          </Typography>
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            Quick Links
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Link href="/" underline="hover" sx={{ color: '#FFFFFF' }}>Home</Link>
            <Link href="/login" underline="hover" sx={{ color: '#FFFFFF' }}>Login</Link>
            <Link href="/signup" underline="hover" sx={{ color: '#FFFFFF' }}>Register</Link>
            <Link href="/services" underline="hover" sx={{ color: '#FFFFFF' }}>Services</Link>
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            Legal & Contact
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Link href="/privacy" underline="hover" sx={{ color: '#FFFFFF' }}>Privacy Policy</Link>
            <Link href="/terms" underline="hover" sx={{ color: '#FFFFFF' }}>Terms & Conditions</Link>
            <Link href="/contact" underline="hover" sx={{ color: '#FFFFFF' }}>Contact Us</Link>
          </Box>
        </Grid>
      </Grid>

      {/* שורת זכויות יוצרים בצד השמאלי של המסך */}
      <Box sx={{ mt: 4, textAlign: 'left', width: '100%', px: 4 }}>
        <Typography variant="body2" color="backgroundColor: '#002D62'">
          &copy; {new Date().getFullYear()} FutureBank. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
