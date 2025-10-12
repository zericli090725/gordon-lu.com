import { AppBar, Toolbar, Typography, Button, Box, Avatar } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import CollectionsIcon from '@mui/icons-material/Collections';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import iconImage from '../assets/icon.png';

function Navbar() {
  const location = useLocation();

  const navItems = [
    { label: 'Home', path: '/', icon: <HomeIcon /> },
    { label: 'Gallery', path: '/gallery', icon: <CollectionsIcon /> },
    { label: 'Contact', path: '/contact', icon: <ContactMailIcon /> }
  ];

  return (
    <AppBar position="static" sx={{ backgroundColor: '#8a8a8a' }}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Avatar 
            src={iconImage} 
            alt="Gordon Lu" 
            sx={{ width: 32, height: 32, mr: 2 }}
          />
          <Typography variant="h6" component="div">
            Gordon Lu
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {navItems.map((item) => (
            <Button
              key={item.path}
              color="inherit"
              component={Link}
              to={item.path}
              startIcon={item.icon}
              sx={{
                backgroundColor: location.pathname === item.path ? 'rgba(255,255,255,0.1)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
