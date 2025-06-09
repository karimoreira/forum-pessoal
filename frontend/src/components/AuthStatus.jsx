import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function AuthStatus() {
  const [userEmail, setUserEmail] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserEmail(decoded.email);
        console.log('[DEBUG] Logado como:', decoded.email);
      } catch (err) {
        console.error('Token inválido:', err);
        localStorage.removeItem('token');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUserEmail(null);
    navigate('/login');
  };

  if (!userEmail) return null;

  return (
    <div style={{ background: '#eee', padding: 10, textAlign: 'right' }}>
      Logado como <strong>{userEmail}</strong>{' '}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default AuthStatus;
