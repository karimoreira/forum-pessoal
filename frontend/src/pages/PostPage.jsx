import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Divider,
  Button,
  Skeleton
} from '@mui/material';
import {
  AccessTime as AccessTimeIcon,
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import api from '../api';

function PostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/api/posts/${id}`)
      .then(res => {
        setPost(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erro ao carregar post:', err);
        setError('Post não encontrado ou erro ao carregar.');
        setLoading(false);
      });
  }, [id]);

  const formatDate = (dateString) => {
    const options = { 
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4 }}>
          <Skeleton variant="text" width={100} height={40} />
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Skeleton variant="text" width="80%" height={60} />
              <Skeleton variant="text" width="40%" height={30} sx={{ mt: 2 }} />
              <Skeleton variant="rectangular" height={200} sx={{ mt: 3 }} />
            </CardContent>
          </Card>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/')}
            sx={{ mb: 2 }}
          >
            Voltar
          </Button>
          <Card>
            <CardContent>
              <Typography color="error">{error}</Typography>
            </CardContent>
          </Card>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ mb: 2 }}
        >
          Voltar
        </Button>

        <Card>
          <CardContent>
            <Typography variant="h4" component="h1" gutterBottom>
              {post.title}
            </Typography>

            {post.image && (
              <Box sx={{ mb: 3 }}>
                <CardMedia
                  component="img"
                  image={post.image}
                  alt={post.title}
                  sx={{ 
                    width: '100%',
                    maxHeight: 500,
                    objectFit: 'contain',
                    borderRadius: 1
                  }}
                />
              </Box>
            )}

            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2, 
              mb: 3,
              color: 'text.secondary'
            }}>
              {post.author && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon fontSize="small" />
                  <Typography variant="body2">
                    {post.author.username || 'Anônimo'}
                  </Typography>
                </Box>
              )}

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccessTimeIcon fontSize="small" />
                <Typography variant="body2">
                  {formatDate(post.createdAt)}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Typography variant="body1" sx={{ 
              whiteSpace: 'pre-wrap',
              lineHeight: 1.8
            }}>
              {post.content}
            </Typography>

            {post.tags && post.tags.length > 0 && (
              <Box sx={{ mt: 4, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {post.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}

export default PostPage;
