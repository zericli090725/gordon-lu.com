import { Typography, Container, Box, TextField, Button, Alert } from '@mui/material';
import { useState } from 'react';
import { api } from '../lib/api';
function Contact() {
  const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [body, setBody] = useState('');
  const [ok, setOk] = useState(''); const [err, setErr] = useState('');
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault(); setOk(''); setErr('');
    try {
      await api('/api/messages', { method: 'POST', body: JSON.stringify({ name, email, body }) });
      setOk('Message sent!'); setName(''); setEmail(''); setBody('');
    }
    catch (e: any) { setErr(e.message || 'Failed'); }
  }
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Contact
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }} align="center">
          Leave a message for Gordon Lu!
        </Typography>

        {ok && <Alert severity="success" sx={{ mb: 2 }}>{ok}</Alert>}
        {err && <Alert severity="error" sx={{ mb: 2 }}>{err}</Alert>}

        <Box component="form" onSubmit={onSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Message"
            variant="outlined"
            multiline
            rows={6}
            fullWidth
            required
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <Button type="submit" variant="contained" sx={{ backgroundColor: '#8a8a8a' }} size="large">
            Send Message
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default Contact;
