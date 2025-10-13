import { Box, Typography, Button, Container, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

function NotFound() {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 6, 
          textAlign: 'center',
          borderRadius: 3,
          background: 'linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)',
          border: `2px solid #8a8a8a`
        }}
      >
        <Box sx={{ mb: 4 }}>
          <ErrorOutlineIcon 
            sx={{ 
              fontSize: 120, 
              color: '#8a8a8a',
              mb: 2,
              opacity: 0.8
            }} 
          />
        </Box>

        <Typography 
          variant="h1" 
          component="h1" 
          sx={{ 
            fontSize: { xs: '4rem', md: '6rem' },
            fontWeight: 'bold',
            color: '#8a8a8a',
            mb: 2,
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          404
        </Typography>

        <Typography 
          variant="h4" 
          component="h2" 
          sx={{ 
            color: '#666',
            mb: 3,
            fontWeight: 500
          }}
        >
          Page Not Found
        </Typography>

        <Typography 
          variant="body1" 
          sx={{ 
            color: '#777',
            mb: 4,
            fontSize: '1.1rem',
            lineHeight: 1.6,
            maxWidth: '500px',
            mx: 'auto'
          }}
        >
          Oops! The page you're looking for doesn't exist. It might have been moved, 
          deleted, or you entered the wrong URL.
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            component={Link}
            to="/"
            startIcon={<HomeIcon />}
            sx={{
              backgroundColor: '#8a8a8a',
              color: 'white',
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              borderRadius: 2,
              textTransform: 'none',
              boxShadow: '0 4px 12px rgba(138, 138, 138, 0.3)',
              '&:hover': {
                backgroundColor: '#757575',
                boxShadow: '0 6px 16px rgba(138, 138, 138, 0.4)',
                transform: 'translateY(-2px)',
                transition: 'all 0.3s ease'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Go Home
          </Button>

          <Button
            variant="outlined"
            onClick={() => window.history.back()}
            startIcon={<ArrowBackIcon />}
            sx={{
              borderColor: '#8a8a8a',
              color: '#8a8a8a',
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              borderRadius: 2,
              textTransform: 'none',
              '&:hover': {
                borderColor: '#757575',
                color: '#757575',
                backgroundColor: 'rgba(138, 138, 138, 0.05)',
                transform: 'translateY(-2px)',
                transition: 'all 0.3s ease'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Go Back
          </Button>
        </Box>

        <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid #e0e0e0' }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#999',
              fontStyle: 'italic'
            }}
          >
            Need help? Check out our{' '}
            <Link 
              to="/contact" 
              style={{ 
                color: '#8a8a8a', 
                textDecoration: 'none',
                fontWeight: 500
              }}
            >
              Contact page
            </Link>
            {' '}or{' '}
            <Link 
              to="/gallery" 
              style={{ 
                color: '#8a8a8a', 
                textDecoration: 'none',
                fontWeight: 500
              }}
            >
              Gallery
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default NotFound;
