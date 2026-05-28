import { useNavigate, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import HomeIcon from '@mui/icons-material/Home';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import LoginIcon from '@mui/icons-material/Login';
import { useAuth } from '../context/AuthContext';

export default function NotFound() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { isAuthenticated } = useAuth();

  let action;
  if (isAuthenticated) {
    action = { label: 'Go Home', icon: <HomeIcon />, to: '/advisor/dashboard' };
  } else if (pathname.startsWith('/advisor')) {
    action = { label: 'Log in', icon: <LoginIcon />, to: '/advisor/login' };
  } else {
    action = { label: 'Submit a Case', icon: <HomeIcon />, to: '/submit' };
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: [
          'radial-gradient(ellipse 80% 50% at 20% 30%, rgba(29,78,216,0.18) 0%, transparent 60%)',
          'radial-gradient(ellipse 60% 45% at 80% 70%, rgba(0,137,123,0.14) 0%, transparent 55%)',
          'linear-gradient(160deg, #060D1F 0%, #0A1628 55%, #0C1D30 100%)',
        ].join(', '),
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 5,
          maxWidth: 440,
          width: '100%',
          mx: 2,
          borderRadius: 3,
          background: 'rgba(255,255,255,0.97)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.08)',
          textAlign: 'center',
        }}
      >
        <Typography
          variant="h1"
          fontWeight={800}
          sx={{
            fontSize: '6rem',
            lineHeight: 1,
            background: 'linear-gradient(135deg, #1565C0 0%, #00897B 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2,
          }}
        >
          404
        </Typography>

        <Typography variant="h5" fontWeight={700} color="text.primary" gutterBottom>
          Page not found
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          The page you're looking for doesn't exist or has been moved.
        </Typography>

        <Button
          variant="contained"
          size="large"
          startIcon={action.icon}
          onClick={() => navigate(action.to)}
          sx={{
            py: 1.5,
            borderRadius: 2,
            fontWeight: 600,
            backgroundImage: 'linear-gradient(135deg, #1565C0 0%, #1976D2 100%)',
            boxShadow: '0 4px 16px rgba(21,101,192,0.35)',
            '&:hover': { boxShadow: '0 6px 20px rgba(21,101,192,0.45)' },
          }}
        >
          {action.label}
        </Button>
      </Paper>
    </Box>
  );
}
