import { useEffect, useState } from 'react';
import { Container, Typography, Box, Paper, Button, Alert } from '@mui/material';

type Msg = { id:number; name:string; email:string; message:string; created_at:string };

export default function Admin() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [err, setErr] = useState<string|null>(null);

  const token = localStorage.getItem('admin.token') || '';

  const load = async () => {
    setErr(null);
    try {
      const res = await fetch('/api/messages', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Unauthorized or error');
      const j = await res.json();
      setMessages(j.messages || []);
    } catch (e:any) {
      setErr(e.message || 'Failed to load');
    }
  };

  const delMsg = async (id:number) => {
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method:'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Delete failed');
      await load();
    } catch (e:any) {
      alert(e.message || 'Delete failed');
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <Container maxWidth="md" sx={{ my: 5 }}>
      <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mb:2 }}>
        <Typography variant="h4">Messages</Typography>
        <Button onClick={load} variant="outlined">Refresh</Button>
      </Box>
      {err && <Alert severity="error" sx={{ mb:2 }}>{err}</Alert>}
      {messages.map(m => (
        <Paper key={m.id} sx={{ p:2, mb:2 }}>
          <Box sx={{ display:'flex', justifyContent:'space-between' }}>
            <Typography variant="subtitle1"><b>{m.name}</b> &lt;{m.email}&gt;</Typography>
            <Typography variant="caption" color="text.secondary">{m.created_at}</Typography>
          </Box>
          <Typography sx={{ whiteSpace:'pre-wrap', mt:1 }}>{m.message}</Typography>
          <Box sx={{ textAlign:'right', mt:1 }}>
            <Button size="small" color="error" onClick={()=>delMsg(m.id)}>Delete</Button>
          </Box>
        </Paper>
      ))}
      {messages.length === 0 && !err && <Typography color="text.secondary">No messages yet.</Typography>}
    </Container>
  );
}
