import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Button,
  Box,
  Container,
  Chip,
  Skeleton,
  Divider
} from '@mui/material';
import {
  AccessTime as AccessTimeIcon,
  Person as PersonIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import api from '../api';

function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/posts')
      .then(res => {
        console.log('Posts recebidos:', res.data.length);
        console.log('Posts com imagem:', res.data.filter(p => p.image).length);
        setPosts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erro ao buscar posts', err);
        setLoading(false);
      });
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'Data não disponível';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Data inválida';
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return 'Data inválida';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 10, mb: 4 }}>
        <Grid container spacing={4}>
          {[1, 2, 3].map((skeleton) => (
            <Grid item xs={12} md={4} key={skeleton}>
              <Card sx={{ height: '100%' }}>
                <Skeleton variant="rectangular" height={200} />
                <CardContent>
                  <Skeleton variant="text" width="60%" height={32} />
                  <Skeleton variant="text" width="100%" height={20} />
                  <Skeleton variant="text" width="100%" height={20} />
                  <Box sx={{ mt: 2 }}>
                    <Skeleton variant="text" width="40%" height={24} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 10, mb: 4 }}>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Blog Dev
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Compartilhe conhecimento e aprenda com outros desenvolvedores
        </Typography>
        <Divider />
      </Box>

      <Grid container spacing={4}>
        {posts.length === 0 ? (
          <Grid item xs={12}>
            <Card sx={{ textAlign: 'center', py: 4 }}>
              <CardContent>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Nenhum post publicado ainda
                </Typography>
                <Button
                  component={RouterLink}
                  to="/new"
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                >
                  Criar Primeiro Post
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ) : (
          posts.map(post => (
            <Grid item xs={12} md={4} key={post._id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                  }
                }}
              >
                {post.image && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={post.image}
                    alt={post.title}
                    sx={{
                      objectFit: 'cover',
                      backgroundColor: 'background.paper'
                    }}
                    onError={(e) => {
                      console.error('Erro ao carregar imagem:', post._id);
                      e.target.style.display = 'none';
                    }}
                  />
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography 
                    variant="h5" 
                    component="h2" 
                    gutterBottom
                    sx={{ 
                      fontWeight: 'bold',
                      fontSize: '1.25rem',
                      lineHeight: 1.4,
                      mb: 2
                    }}
                  >
                    {post.title}
                  </Typography>
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      mb: 2,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      lineHeight: 1.6
                    }}
                  >
                    {post.content}
                  </Typography>

                  <Box sx={{ mt: 'auto' }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 2,
                      mb: 2
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <PersonIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {post.author?.username || 'Anônimo'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <AccessTimeIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(post.createdAt)}
                        </Typography>
                      </Box>
                    </Box>

                    <Button
                      component={RouterLink}
                      to={`/post/${post._id}`}
                      endIcon={<ArrowForwardIcon />}
                      sx={{ 
                        textTransform: 'none',
                        fontWeight: 500
                      }}
                    >
                      Ler mais
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
}

export default HomePage;
