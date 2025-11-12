import React from 'react';
import { Box, Typography } from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

const FutureBankLogo = ({ size = 60, color = '#002D62', compact = false }) => {
  // אם compact = true, הגודל של הטקסט יהיה קטן יותר, gap קטן יותר
  const textSize = compact ? size * 0.35 : size * 0.5;
  const gapSize = compact ? 2 : size * 0.15;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: gapSize }}>
      <AccountBalanceIcon sx={{ fontSize: size, color: color }} />
      <Typography
        sx={{
          fontWeight: 'bold',
          fontSize: textSize,
          lineHeight: 1,
          color: color,
        }}
      >
        FutureBank
      </Typography>
    </Box>
  );
};

export default FutureBankLogo;
