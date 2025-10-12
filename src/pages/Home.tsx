import { Typography, Container, Box } from '@mui/material';
import welcomeImage from '../assets/Welcome1.png';

function Home() {
  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to Gordon Lu's Website
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          This is the home page of Gordon Lu's personal website. Explore the gallery and contact sections to learn more.
        </Typography>
        <Box sx={{ mb: 4 }}>
          <img 
            src={welcomeImage} 
            alt="Welcome" 
            style={{ 
              maxWidth: '400px', 
              width: '100%',
              height: 'auto',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
            }} 
          />
        </Box>
      </Box>
    </Container>
  );
}

export default Home;
