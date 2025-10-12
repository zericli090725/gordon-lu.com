import { Typography, Container, Box, Grid, Card, CardContent } from '@mui/material';

function Gallery() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Gallery
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }} align="center">
          Explore Gordon Lu's interesting pictures!
        </Typography>
        
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="div">
                    Project {item}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Description of project {item} goes here.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}

export default Gallery;
