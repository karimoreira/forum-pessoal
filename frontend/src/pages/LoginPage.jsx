import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      alert('Login realizado com sucesso!');
      navigate('/');
    } catch (err) {
      alert(err.response.data.error || 'Erro no login');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="E-mail" required />
      <br />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Senha" required />
      <br />
      <button type="submit">Entrar</button>
    </form>
  );
}

export default LoginPage;
