import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  IconButton,
  CardMedia
} from '@mui/material';
import {
  CreateOutlined as CreateOutlinedIcon,
  AddPhotoAlternate as AddPhotoAlternateIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import api from '../api';

function NewPostPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: ''
  });
  const [imagePreview, setImagePreview] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) { // 8MB
        setError('A imagem deve ter no máximo 8MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({
          ...prev,
          image: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview('');
    setFormData(prev => ({
      ...prev,
      image: ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      console.log('Enviando post com imagem:', formData.image ? 'Sim' : 'Não');
      console.log('Tamanho da imagem:', formData.image?.length);

      await api.post('/api/posts', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      navigate('/');
    } catch (err) {
      console.error('Erro detalhado:', err);
      setError(err.response?.data?.message || 'Erro ao criar post. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 10, mb: 4 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            backgroundColor: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2
          }}
        >
          <CreateOutlinedIcon sx={{ color: 'white' }} />
        </Box>
        
        <Typography component="h1" variant="h5" gutterBottom>
          Novo Post
        </Typography>

        <Card sx={{ width: '100%', mt: 2 }}>
          <CardContent>
            <Box component="form" onSubmit={handleSubmit}>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <TextField
                margin="normal"
                required
                fullWidth
                id="title"
                label="Título"
                name="title"
                autoFocus
                value={formData.title}
                onChange={handleChange}
                disabled={loading}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                multiline
                rows={8}
                name="content"
                label="Conteúdo"
                id="content"
                value={formData.content}
                onChange={handleChange}
                disabled={loading}
              />

              <Box sx={{ mt: 3, mb: 2 }}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="image-upload"
                  type="file"
                  onChange={handleImageChange}
                  disabled={loading}
                />
                <label htmlFor="image-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<AddPhotoAlternateIcon />}
                    disabled={loading}
                  >
                    Adicionar Imagem
                  </Button>
                </label>
              </Box>

              {imagePreview && (
                <Box sx={{ position: 'relative', mb: 3 }}>
                  <CardMedia
                    component="img"
                    image={imagePreview}
                    alt="Preview"
                    sx={{ 
                      maxHeight: 300,
                      objectFit: 'contain',
                      borderRadius: 1
                    }}
                  />
                  <IconButton
                    onClick={removeImage}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      '&:hover': {
                        backgroundColor: 'rgba(0,0,0,0.7)'
                      }
                    }}
                  >
                    <ClearIcon sx={{ color: 'white' }} />
                  </IconButton>
                </Box>
              )}

              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button
                  type="button"
                  fullWidth
                  variant="outlined"
                  onClick={() => navigate('/')}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                >
                  {loading ? 'Publicando...' : 'Publicar'}
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}

export default NewPostPage;
