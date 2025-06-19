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
  CardMedia,
  Chip,
  Stack
} from '@mui/material';
import {
  CreateOutlined as CreateOutlinedIcon,
  AddPhotoAlternate as AddPhotoAlternateIcon,
  Clear as ClearIcon,
  Add as AddIcon
} from '@mui/icons-material';
import api from '../api';

function NewPostPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: null,
    tags: []
  });
  const [imagePreview, setImagePreview] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [newTag, setNewTag] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB
        setError('A imagem deve ter no máximo 5MB');
        return;
      }

      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
          
          // Criar objeto de imagem para obter dimensões
          const img = new Image();
          img.onload = () => {
            setFormData(prev => ({
              ...prev,
              image: {
                url: reader.result,
                alt: file.name,
                dimensions: {
                  width: img.width,
                  height: img.height
                }
              }
            }));
          };
          img.src = reader.result;
        };
        reader.readAsDataURL(file);
      } catch (err) {
        setError('Erro ao processar imagem. Tente novamente.');
        console.error('Erro ao processar imagem:', err);
      }
    }
  };

  const removeImage = () => {
    setImagePreview('');
    setFormData(prev => ({
      ...prev,
      image: null
    }));
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleDeleteTag = (tagToDelete) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToDelete)
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

      // Validações básicas
      if (!formData.title.trim()) {
        throw new Error('O título é obrigatório');
      }
      if (!formData.content.trim()) {
        throw new Error('O conteúdo é obrigatório');
      }

      await api.post('/api/posts', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      navigate('/');
    } catch (err) {
      console.error('Erro ao criar post:', err);
      setError(err.response?.data?.error || err.message || 'Erro ao criar post. Tente novamente.');
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

              <Box sx={{ mt: 3, mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Tags
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <TextField
                    size="small"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Adicionar tag"
                    disabled={loading}
                  />
                  <Button
                    variant="outlined"
                    onClick={handleAddTag}
                    disabled={!newTag.trim() || loading}
                    startIcon={<AddIcon />}
                  >
                    Adicionar
                  </Button>
                </Box>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {formData.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      onDelete={() => handleDeleteTag(tag)}
                      disabled={loading}
                    />
                  ))}
                </Stack>
              </Box>

              <Box sx={{ mt: 3 }}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                >
                  {loading ? 'Publicando...' : 'Publicar Post'}
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
