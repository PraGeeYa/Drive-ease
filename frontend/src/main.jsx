import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import theme from './theme' // Importing the custom theme we created
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Wrapping the App with ThemeProvider to apply DriveEase custom styles */}
    <ThemeProvider theme={theme}>
      {/* CssBaseline resets default browser CSS to follow MUI theme standards */}
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
)