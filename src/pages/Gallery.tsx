import { useEffect, useState } from "react";
import {
  Container, Box, Typography, Card, CardContent,
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  CircularProgress, Alert, Modal, IconButton
} from "@mui/material";
import { Close as CloseIcon } from '@mui/icons-material';

type CardBrief = {
  id: number;
  slug: string;
  title: string;
  summary: string;
  coverUrl: string | null;
  locked: boolean; // always true in current API
};

type ContentItem = { type: "image" | "video"; url: string };

export default function Gallery() {
  const [cards, setCards] = useState<CardBrief[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // password dialog state
  const [openId, setOpenId] = useState<number | null>(null);
  const [password, setPassword] = useState("");
  const [unlockErr, setUnlockErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // loaded content per card
  const [content, setContent] = useState<Record<number, ContentItem[]>>({});
  
  // modal state
  const [selectedCard, setSelectedCard] = useState<CardBrief | null>(null);

  // --- helpers ---
  const tokenKey = (id: number) => `gallery.token.${id}`;

  const loadCards = async () => {
    setLoading(true);
    setErr(null);
    try {
      console.log('Loading gallery cards...');
      const res = await fetch("/api/gallery");
      console.log('Gallery API response:', res.status, res.statusText);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Gallery API error:', errorText);
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      
      const data = await res.json();
      console.log('Gallery data received:', data);
      setCards(data.cards || []);
    } catch (e: any) {
      console.error('Gallery load error:', e);
      setErr(e.message || "Failed to load gallery.");
    } finally {
      setLoading(false);
    }
  };

  const loadContent = async (cardId: number, token: string) => {
    const res = await fetch(`/api/gallery/${cardId}/content`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to load content");
    const data = await res.json();
    setContent(prev => ({ ...prev, [cardId]: data.items || [] }));
  };

  // --- effects ---
  useEffect(() => { loadCards(); }, []);

  // if we already have tokens stored, try to preload content
  useEffect(() => {
    (async () => {
      for (const c of cards) {
        if (content[c.id]) continue;
        const token = localStorage.getItem(tokenKey(c.id));
        if (token) {
          try { await loadContent(c.id, token); } catch { /* ignore */ }
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards.length]);

  // --- actions ---
  const startUnlock = (id: number) => {
    setOpenId(id);
    setPassword("");
    setUnlockErr(null);
  };

  const handleUnlock = async (card: CardBrief) => {
    setBusy(true);
    setUnlockErr(null);
    try {
      const res = await fetch(`/api/gallery/${card.id}/unlock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.error || "Invalid password");
      }
      const { token } = await res.json();
      localStorage.setItem(tokenKey(card.id), token);
      await loadContent(card.id, token);
      setOpenId(null);
      setPassword("");
      // Open modal after successful unlock
      setSelectedCard(card);
    } catch (e: any) {
      setUnlockErr(e.message || "Unlock failed");
    } finally {
      setBusy(false);
    }
  };

  const clearToken = (id: number) => {
    localStorage.removeItem(tokenKey(id));
    setContent(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const handleModalClose = () => {
    if (selectedCard) {
      clearToken(selectedCard.id);
      setSelectedCard(null);
    }
  };

  // --- UI ---
  return (
    <Container maxWidth="lg" sx={{ my: 5 }}>
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography variant="h3" gutterBottom>Gallery</Typography>
        <Typography color="text.secondary">
          Explore password-protected cards. Enter the password to view photos and videos.
        </Typography>
        <Typography color="text.secondary">
          Email zeenli720@gmail.com for passwords to specific galleries.
        </Typography>
      </Box>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && err && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {err}
          <br />
          <Typography variant="body2" sx={{ mt: 1 }}>
            If this persists, please check your internet connection or try refreshing the page.
          </Typography>
        </Alert>
      )}

      {!loading && !err && (
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)'
          },
          gap: 3,
          width: '100%'
        }}>
          {cards.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No gallery cards available
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Please check back later or contact the administrator.
              </Typography>
            </Box>
          ) : (
            cards.map(card => {
              const items = content[card.id] || null;
              return (
                <Box key={card.id}>
                  <Card variant="outlined" sx={{ 
                    height: '250px',
                    display: 'flex',
                    flexDirection: 'column',
                    borderColor: '#8a8a8a',
                    borderRadius: 2,
                    transition: 'all 0.2s ease-in-out',
                    cursor: items ? 'pointer' : 'default',
                    position: 'relative',
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(138, 138, 138, 0.15)',
                      transform: 'translateY(-2px)',
                      backgroundColor: 'rgba(0, 0, 0, 0.02)'
                    }
                  }}
                  onClick={() => items && setSelectedCard(card)}
                  >
                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="h6">{card.title}</Typography>
                      <Typography variant="body2" color="text.secondary">{card.summary}</Typography>

                      {!items && (
                        <Button 
                          variant="outlined" 
                          onClick={(e) => {
                            e.stopPropagation();
                            startUnlock(card.id);
                          }}
                          sx={{
                            position: 'absolute',
                            bottom: 16,
                            right: 16,
                            zIndex: 1,
                            borderColor: '#8a8a8a',
                            color: '#8a8a8a',
                            '&:hover': {
                              borderColor: '#6a6a6a',
                              backgroundColor: 'rgba(138, 138, 138, 0.04)'
                            }
                          }}
                        >
                          Unlock
                        </Button>
                      )}

                      {items && (
                        <Box sx={{ mt: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                          <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                            <Button 
                              size="small" 
                              variant="outlined"
                              onClick={(e) => {
                                e.stopPropagation();
                                clearToken(card.id);
                              }}
                              sx={{
                                borderColor: '#8a8a8a',
                                color: '#8a8a8a',
                                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                minWidth: { xs: '60px', sm: 'auto' },
                                '&:hover': {
                                  borderColor: '#6a6a6a',
                                  backgroundColor: 'rgba(138, 138, 138, 0.04)'
                                }
                              }}
                            >
                              Lock
                            </Button>
                          </Box>
                          <Box sx={{ 
                            flexGrow: 1,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            overflow: "hidden"
                          }}>
                            {items.length > 0 && (
                              <img 
                                src={items[0].url} 
                                alt="" 
                                style={{ 
                                  borderRadius: 8, 
                                  maxHeight: "200px", 
                                  maxWidth: "100%",
                                  width: "auto",
                                  height: "auto",
                                  objectFit: "contain",
                                  display: "block"
                                }} 
                              />
                            )}
                            {items.length > 1 && (
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                +{items.length - 1} more
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      )}
                    </CardContent>
                  </Card>

                  {/* Password dialog */}
                  <Dialog open={openId === card.id} onClose={() => setOpenId(null)}>
                    <DialogTitle>Enter password</DialogTitle>
                    <DialogContent>
                      <TextField
                        autoFocus
                        fullWidth
                        type="password"
                        label="Password"
                        margin="dense"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleUnlock(card)}
                      />
                      {unlockErr && <Alert severity="error" sx={{ mt: 1 }}>{unlockErr}</Alert>}
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={() => setOpenId(null)}>Cancel</Button>
                      <Button onClick={() => handleUnlock(card)} variant="contained" color="inherit" disabled={busy}>
                        {busy ? "Checking..." : "Unlock"}
                      </Button>
                    </DialogActions>
                  </Dialog>
                </Box>
              );
            })
          )}
        </Box>
      )}

      {/* Gallery Modal */}
      <Modal
        open={!!selectedCard}
        onClose={handleModalClose}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: { xs: '95%', sm: '90%', md: '80%', lg: '70%' },
            maxWidth: '1200px',
            maxHeight: '90vh',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            outline: 'none',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Header */}
          <Box sx={{
            p: 3,
            pb: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexShrink: 0
          }}>
            <Typography variant="h4" component="h2" sx={{ fontWeight: 600 }}>
              {selectedCard?.title}
            </Typography>
            <IconButton
              onClick={handleModalClose}
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                }
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Content */}
          <Box sx={{
            p: 3,
            flexGrow: 1,
            overflow: 'auto',
            minHeight: 0
          }}>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {selectedCard?.summary}
            </Typography>
            
            {selectedCard && content[selectedCard.id] && (
              <Box sx={{ 
                display: "grid",
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                  lg: 'repeat(4, 1fr)'
                },
                gap: 2,
                justifyContent: "center",
                alignItems: "flex-start"
              }}>
                {content[selectedCard.id].map((item, i) =>
                  item.type === "image" ? (
                    <img 
                      key={i} 
                      src={item.url} 
                      alt="" 
                      style={{ 
                        borderRadius: 8, 
                        maxHeight: "300px", 
                        maxWidth: "100%",
                        width: "auto",
                        height: "auto",
                        objectFit: "contain",
                        display: "block"
                      }} 
                    />
                  ) : (
                    <video 
                      key={i} 
                      src={item.url} 
                      controls 
                      style={{ 
                        borderRadius: 8, 
                        maxHeight: "300px", 
                        maxWidth: "100%",
                        width: "auto",
                        height: "auto",
                        objectFit: "contain",
                        display: "block"
                      }} 
                    />
                  )
                )}
              </Box>
            )}
          </Box>
        </Box>
      </Modal>
    </Container>
  );
}