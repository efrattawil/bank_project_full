import React from 'react';
import { Box, Typography, Link } from '@mui/material';
import FutureBankLogo from './FutureBankLogo';

const FooterSmall = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#002D62',
        color: '#FFFFFF',
        py: 2,
        mt: 'auto',
        width: '100%',
        textAlign: 'center',
      }}
    >
      <FutureBankLogo size={40} color="#FFFFFF" compact />
      <Typography variant="body2" sx={{ mt: 1, fontSize: '0.7rem' }}>
        &copy; {new Date().getFullYear()} FutureBank. All rights reserved.
      </Typography>
      <Box sx={{ mt: 0.5 }}>
        <Link href="/" underline="hover" sx={{ color: '#FFFFFF', mx: 0.5, fontSize: '0.7rem' }}>Home</Link>|
        <Link href="/privacy" underline="hover" sx={{ color: '#FFFFFF', mx: 0.5, fontSize: '0.7rem' }}>Privacy</Link>
      </Box>
    </Box>
  );
};

export default FooterSmall;
