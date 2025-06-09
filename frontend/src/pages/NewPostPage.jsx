import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

function NewPostPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Você precisa estar logado para acessar esta página.');
      navigate('/login');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageBase64 = '';
    if (image) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        imageBase64 = reader.result;
        await api.post('/posts', { title, content, image: imageBase64 });
        alert('Post criado com sucesso!');
        navigate('/');
      };
      reader.readAsDataURL(image);
    } else {
      await api.post('/posts', { title, content, image: '' });
      alert('Post criado com sucesso!');
      navigate('/');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Novo Post</h2>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Título" required />
      <br />
      <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Conteúdo" required />
      <br />
      <input type="file" onChange={e => setImage(e.target.files[0])} />
      <br />
      <button type="submit">Publicar</button>
    </form>
  );
}

export default NewPostPage;
