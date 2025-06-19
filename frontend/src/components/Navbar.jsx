import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Avatar, Menu, MenuItem, IconButton } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { CreateOutlined as CreateOutlinedIcon, AccountCircle as AccountCircleIcon } from '@mui/icons-material';
import api from '../api';

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/api/auth/me')
        .then(res => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('token');
          setUser(null);
        });
    }
  }, []);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    handleClose();
    navigate('/');
  };

  return (
    <AppBar position="fixed" sx={{ 
      backgroundColor: '#1a237e',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <Container>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              textDecoration: 'none',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            Fórum Dev
          </Typography>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {user ? (
              <>
                <Button
                  component={RouterLink}
                  to="/new"
                  variant="contained"
                  color="secondary"
                  startIcon={<CreateOutlinedIcon />}
                  sx={{ 
                    fontWeight: 'bold',
                    textTransform: 'none',
                    '&:hover': { backgroundColor: '#651fff' }
                  }}
                >
                  Novo Post
                </Button>
                <IconButton
                  onClick={handleMenu}
                  color="inherit"
                  size="large"
                  sx={{ ml: 1 }}
                >
                  {user.avatar ? (
                    <Avatar src={user.avatar} sx={{ width: 32, height: 32 }} />
                  ) : (
                    <AccountCircleIcon />
                  )}
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  <MenuItem disabled>
                    <Typography variant="body2" color="textSecondary">
                      Olá, {user.username}
                    </Typography>
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Sair</MenuItem>
                </Menu>
              </>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="outlined"
                  color="inherit"
                  sx={{ 
                    borderColor: 'white',
                    '&:hover': { borderColor: '#fff', backgroundColor: 'rgba(255,255,255,0.1)' }
                  }}
                >
                  Login
                </Button>
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  color="secondary"
                  sx={{ 
                    fontWeight: 'bold',
                    '&:hover': { backgroundColor: '#651fff' }
                  }}
                >
                  Cadastrar
                </Button>
              </div>
            )}
          </div>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar; 