import { useEffect, useState } from "react";
import {
  Container, Box, Typography, Card, CardContent,
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  CircularProgress, Alert
} from "@mui/material";

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

  // --- helpers ---
  const tokenKey = (id: number) => `gallery.token.${id}`;

  const loadCards = async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/gallery");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setCards(data.cards || []);
    } catch (e: any) {
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

      {!loading && err && <Alert severity="error" sx={{ mb: 3 }}>{err}</Alert>}

      {!loading && !err && (
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: '1fr', 
            sm: cards.some(c => content[c.id]) ? 'repeat(1, 1fr)' : 'repeat(2, 1fr)', 
            md: cards.some(c => content[c.id]) ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)' 
          },
          gap: 3 
        }}>
          {cards.map(card => {
            const items = content[card.id] || null;
            return (
              <Box key={card.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{card.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{card.summary}</Typography>

                    {!items && (
                      <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                        <Button variant="contained" color="inherit" onClick={() => startUnlock(card.id)}>
                          Unlock
                        </Button>
                      </Box>
                    )}

                    {items && (
                      <Box sx={{ mt: 2 }}>
                        <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                          <Button size="small" onClick={() => clearToken(card.id)}>Lock</Button>
                        </Box>
                        <Box sx={{ 
                          display: "flex", 
                          flexDirection: { xs: "column", sm: "row" },
                          gap: 1,
                          overflowX: "auto",
                          "& > *": {
                            minWidth: { xs: "100%", sm: "200px" },
                            maxWidth: { xs: "100%", sm: "300px" }
                          }
                        }}>
                          {items.map((it, i) =>
                            it.type === "image" ? (
                              <img key={i} src={it.url} alt="" style={{ borderRadius: 8, maxHeight: "300px", width: "auto" }} />
                            ) : (
                              <video key={i} src={it.url} controls style={{ borderRadius: 8, maxHeight: "300px", width: "auto" }} />
                            )
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
          })}
        </Box>
      )}
    </Container>
  );
}