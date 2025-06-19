import React from 'react';
import { Button, Typography } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import api from '../api';

function AuthStatus() {
  const navigate = useNavigate();
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setUser(res.data))
      .catch(() => {
        localStorage.removeItem('token');
        setUser(null);
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  if (!user) {
    return (
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Button
          component={RouterLink}
          to="/login"
          variant="outlined"
          color="inherit"
          size="small"
          sx={{ borderColor: 'white' }}
        >
          Login
        </Button>
        <Button
          component={RouterLink}
          to="/register"
          variant="contained"
          color="secondary"
          size="small"
        >
          Cadastrar
        </Button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <Typography variant="body2" color="inherit">
        Olá, {user.username}
      </Typography>
      <Button
        onClick={handleLogout}
        variant="outlined"
        color="inherit"
        size="small"
        sx={{ borderColor: 'white' }}
      >
        Sair
      </Button>
    </div>
  );
}

export default AuthStatus;
