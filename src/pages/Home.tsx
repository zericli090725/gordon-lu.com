import { Typography, Container, Box, Card, CardMedia } from '@mui/material';
import welcomeImage from '../assets/Welcome1.png';

function Home() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to Gordon Lu's Website
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          This is the home page of Gordon Lu's personal website, explore the gallery and contact sections to learn more!
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          mb: 4,
          px: { xs: 2, sm: 0 }
        }}>
          <Card 
            sx={{ 
              maxWidth: { xs: '100%', sm: '400px', md: '500px' },
              width: '100%',
              borderRadius: 2,
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              overflow: 'hidden'
            }}
          >
            <CardMedia
              component="img"
              image={welcomeImage}
              alt="Welcome"
              sx={{
                width: '100%',
                height: 'auto',
                objectFit: 'cover'
              }}
            />
          </Card>
        </Box>
      </Box>
    </Container>
  );
}

export default Home;
