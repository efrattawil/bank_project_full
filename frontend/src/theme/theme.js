import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#002D62', 
    },
    secondary: {
      main: '#FFC107', 
    },
    background: {
      default: '#F5F5F5',
      paper: 'rgba(255,255,255,0.9)', 
    },
    text: {
      primary: '#1B1B1B', 
      secondary: '#4E4E4E', 
    },
  },
  typography: {
    fontFamily: `'Inter', 'Roboto', 'Helvetica', sans-serif`,
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500 },
    button: { textTransform: 'none', fontWeight: 700 },
  },
  shape: { borderRadius: 12 },
});

export default theme;
