import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', { email, password });
      alert('Usuário registrado com sucesso!');
      navigate('/login');
    } catch (err) {
      alert(err.response.data.error || 'Erro no registro');
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>Cadastro</h2>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="E-mail" required />
      <br />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Senha" required />
      <br />
      <button type="submit">Registrar</button>
    </form>
  );
}

export default RegisterPage;
