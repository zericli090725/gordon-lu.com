import { Typography, Container, Box } from '@mui/material';

function Gallery() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Gallery
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }} align="center">
          Explore Gordon Lu's interesting galleries!
        </Typography>
      </Box>
    </Container>
  );
}

export default Gallery;
