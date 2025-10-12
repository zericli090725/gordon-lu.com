import { Typography, Container, Box, TextField, Button } from '@mui/material';

function Contact() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Contact
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }} align="center">
          Leave a message for Gordon Lu!
        </Typography>
        
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            required
          />
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            required
            type="email"
          />
          <TextField
            label="Message"
            variant="outlined"
            multiline
            rows={6}
            fullWidth
            required
          />
          <Button variant="contained" sx={{ backgroundColor: '#8a8a8a' }} size="large">
            Send Message
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default Contact;
