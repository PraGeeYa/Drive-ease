import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0014cc',
      light: '#4c8cff',
      dark: '#178c00',
      contrastText: '#fff',
    },
    secondary: {
      main: '#00b0f5',
      light: '#ff5983',
      dark: '#bb1c00',
      contrastText: '#fff',
    },
    background: {
      default: '#f4f7f9',
      paper: '#ffffff',
    },
    text: {
      primary: '#172b4d',
      secondary: '#6b778c',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 800, color: '#172b4d' },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '12px 28px',
          boxShadow: '0 4px 14px 0 rgba(0,82,204,0.15)',
          '&:hover': {
            boxShadow: '0 6px 20px rgba(0,82,204,0.23)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
          border: '1px solid rgba(0,0,0,0.05)',
        },
      },
    },
  },
});

export default theme;