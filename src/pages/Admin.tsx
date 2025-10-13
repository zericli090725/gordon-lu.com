import { useEffect, useState } from 'react';
import { Container, Typography, Box, Button, Alert, Card, CardContent, CardActions, Chip, Divider } from '@mui/material';

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
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mb:3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Messages
        </Typography>
        <Button 
          onClick={load} 
          variant="outlined" 
          sx={{ 
            borderColor: '#8a8a8a',
            color: '#8a8a8a',
            '&:hover': {
              borderColor: '#6a6a6a',
              backgroundColor: 'rgba(138, 138, 138, 0.04)'
            }
          }}
        >
          Refresh
        </Button>
      </Box>
      
      {err && (
        <Alert severity="error" sx={{ mb:3, borderRadius: 2 }}>
          {err}
        </Alert>
      )}
      
      <Box 
        sx={{ 
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)',
            xl: 'repeat(4, 1fr)'
          },
          gap: { xs: 2, sm: 3 },
          px: { xs: 1, sm: 0 }
        }}
      >
        {messages.map(m => (
          <Card 
            key={m.id}
            variant="outlined"
            sx={{ 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              borderColor: '#8a8a8a',
              borderRadius: 2,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(138, 138, 138, 0.15)',
                transform: 'translateY(-2px)'
              }
            }}
          >
            <CardContent sx={{ flexGrow: 1, pb: 1, px: { xs: 1.5, sm: 2 } }}>
              <Box sx={{ 
                display:'flex', 
                justifyContent:'space-between', 
                alignItems:'flex-start', 
                mb: 2,
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 1, sm: 0 }
              }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography 
                    variant="h6" 
                    component="h3" 
                    sx={{ 
                      fontWeight: 600, 
                      mb: 0.5,
                      fontSize: { xs: '1rem', sm: '1.25rem' }
                    }}
                  >
                    {m.name}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      mb: 1,
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      wordBreak: 'break-word'
                    }}
                  >
                    {m.email}
                  </Typography>
                </Box>
                <Chip 
                  label={new Date(m.created_at).toLocaleDateString()} 
                  size="small" 
                  variant="outlined"
                  sx={{ 
                    borderColor: '#8a8a8a',
                    color: '#8a8a8a',
                    fontSize: { xs: '0.7rem', sm: '0.75rem' },
                    alignSelf: { xs: 'flex-start', sm: 'flex-end' }
                  }}
                />
              </Box>
              
              <Divider sx={{ mb: 2, borderColor: '#8a8a8a' }} />
              
              <Typography 
                variant="body2" 
                sx={{ 
                  whiteSpace:'pre-wrap',
                  lineHeight: 1.6,
                  color: 'text.primary',
                  fontSize: { xs: '0.8rem', sm: '0.875rem' }
                }}
              >
                {m.message}
              </Typography>
            </CardContent>
            
            <CardActions sx={{ 
              justifyContent: 'flex-end', 
              px: { xs: 1.5, sm: 2 }, 
              pb: 2,
              pt: 0
            }}>
              <Button 
                size="small" 
                color="error" 
                variant="outlined"
                onClick={()=>delMsg(m.id)}
                sx={{
                  borderColor: '#d32f2f',
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  minWidth: { xs: '60px', sm: 'auto' },
                  '&:hover': {
                    borderColor: '#b71c1c',
                    backgroundColor: 'rgba(211, 47, 47, 0.04)'
                  }
                }}
              >
                Delete
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
      
      {messages.length === 0 && !err && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            No messages yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Messages from the contact form will appear here
          </Typography>
        </Box>
      )}
    </Container>
  );
}
