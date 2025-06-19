import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Container, 
  Avatar, 
  Menu, 
  MenuItem, 
  IconButton,
  Tooltip,
  Badge,
  Fade,
  Divider,
  ListItemIcon,
  Box
} from '@mui/material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  CreateOutlined as CreateOutlinedIcon, 
  AccountCircle as AccountCircleIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  ExitToApp as ExitToAppIcon,
  Person as PersonIcon,
  Code as CodeIcon
} from '@mui/icons-material';
import api from '../api';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setLoading(true);
      api.get('/api/auth/me')
        .then(res => {
          setUser(res.data);
          setLoading(false);
        })
        .catch(() => {
          localStorage.removeItem('token');
          setUser(null);
          setLoading(false);
        });
    } else {
      setLoading(false);
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

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        backgroundColor: 'background.paper',
        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        backdropFilter: 'blur(8px)'
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <CodeIcon sx={{ color: 'primary.main', fontSize: '2rem' }} />
            <Typography
              variant="h6"
              component={RouterLink}
              to="/"
              sx={{
                textDecoration: 'none',
                color: 'text.primary',
                fontWeight: 700,
                fontSize: '1.5rem',
                letterSpacing: '-0.5px',
                '&:hover': {
                  color: 'primary.main',
                  transition: 'color 0.2s ease-in-out'
                }
              }}
            >
              Fórum Dev
            </Typography>
          </Box>
          
          <Fade in={!loading}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {user ? (
                <>
                  <Tooltip title="Novo Post" arrow>
                    <Button
                      component={RouterLink}
                      to="/new"
                      variant="contained"
                      color="primary"
                      startIcon={<CreateOutlinedIcon />}
                      sx={{ 
                        fontWeight: 600,
                        textTransform: 'none',
                        borderRadius: '8px',
                        px: 2,
                        '&:hover': { 
                          transform: 'translateY(-1px)',
                          transition: 'transform 0.2s ease-in-out'
                        }
                      }}
                    >
                      Novo Post
                    </Button>
                  </Tooltip>

                  <Tooltip title="Notificações" arrow>
                    <IconButton color="inherit" size="large">
                      <Badge badgeContent={3} color="error">
                        <NotificationsIcon />
                      </Badge>
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Menu do usuário" arrow>
                    <IconButton
                      onClick={handleMenu}
                      size="large"
                      sx={{ 
                        ml: 0.5,
                        transition: 'transform 0.2s',
                        '&:hover': { transform: 'scale(1.05)' }
                      }}
                    >
                      {user.avatar ? (
                        <Avatar 
                          src={user.avatar} 
                          sx={{ 
                            width: 35, 
                            height: 35,
                            border: '2px solid',
                            borderColor: 'primary.main'
                          }} 
                        />
                      ) : (
                        <Avatar sx={{ 
                          width: 35, 
                          height: 35,
                          bgcolor: 'primary.main'
                        }}>
                          {user.username.charAt(0).toUpperCase()}
                        </Avatar>
                      )}
                    </IconButton>
                  </Tooltip>

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
                    PaperProps={{
                      sx: {
                        mt: 1.5,
                        minWidth: 180,
                        borderRadius: 2,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    <MenuItem disabled sx={{ opacity: 1 }}>
                      <Typography variant="subtitle2" color="text.primary">
                        Olá, {user.username}
                      </Typography>
                    </MenuItem>
                    <Divider />
                    <MenuItem 
                      component={RouterLink} 
                      to="/profile"
                      onClick={handleClose}
                    >
                      <ListItemIcon>
                        <PersonIcon fontSize="small" />
                      </ListItemIcon>
                      Perfil
                    </MenuItem>
                    <MenuItem 
                      component={RouterLink}
                      to="/settings"
                      onClick={handleClose}
                    >
                      <ListItemIcon>
                        <SettingsIcon fontSize="small" />
                      </ListItemIcon>
                      Configurações
                    </MenuItem>
                    <Divider />
                    <MenuItem 
                      onClick={handleLogout}
                      sx={{ color: 'error.main' }}
                    >
                      <ListItemIcon>
                        <ExitToAppIcon fontSize="small" color="error" />
                      </ListItemIcon>
                      Sair
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    component={RouterLink}
                    to="/login"
                    variant="outlined"
                    color="primary"
                    sx={{ 
                      fontWeight: 600,
                      textTransform: 'none',
                      borderRadius: '8px',
                      '&:hover': { 
                        transform: 'translateY(-1px)',
                        transition: 'transform 0.2s ease-in-out'
                      }
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/register"
                    variant="contained"
                    color="primary"
                    sx={{ 
                      fontWeight: 600,
                      textTransform: 'none',
                      borderRadius: '8px',
                      '&:hover': { 
                        transform: 'translateY(-1px)',
                        transition: 'transform 0.2s ease-in-out'
                      }
                    }}
                  >
                    Cadastrar
                  </Button>
                </Box>
              )}
            </Box>
          </Fade>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar; 