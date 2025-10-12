import { Typography, Container, Box, Card, CardContent } from '@mui/material';

function Gallery() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Gallery
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }} align="center">
          Explore Gordon Lu's interesting pictures
        </Typography>
        
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
          gap: 3 
        }}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Card key={item}>
              <CardContent>
                <Typography variant="h6" component="div">
                  Project {item}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Description of project {item} goes here.
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </Container>
  );
}

export default Gallery;
