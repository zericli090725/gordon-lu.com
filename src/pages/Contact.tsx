import { useState } from 'react';
import { Typography, Container, Box, TextField, Button, Alert } from '@mui/material';

function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const [ok, setOk] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setErr(null); setOk(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message: msg }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || `HTTP ${res.status}`);
      }
      setOk('Message sent! Thanks for reaching out.');
      setName(''); setEmail(''); setMsg('');
    } catch (e:any) {
      setErr(e.message || 'Failed to send');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Contact
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }} align="center">
          Leave a message for Gordon Lu!
        </Typography>

        {ok && <Alert severity="success" sx={{ mb: 2 }}>{ok}</Alert>}
        {err && <Alert severity="error" sx={{ mb: 2 }}>{err}</Alert>}

        <Box component="form" onSubmit={onSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField label="Name" value={name} onChange={e=>setName(e.target.value)} fullWidth required />
          <TextField label="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} fullWidth required />
          <TextField label="Message" multiline rows={6} value={msg} onChange={e=>setMsg(e.target.value)} fullWidth required />
          <Button type="submit" variant="contained" sx={{ backgroundColor: '#8a8a8a' }} size="large" disabled={busy}>
            {busy ? 'Sending…' : 'Send Message'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default Contact;
