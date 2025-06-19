const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const authMiddleware = require('../middleware/authMiddleware');

// Função auxiliar para validar imagem
const validateImage = (imageData) => {
  if (!imageData) return true; // Imagem é opcional
  
  // Verifica se é uma string base64 válida
  if (!imageData.startsWith('data:image/')) {
    throw new Error('Formato de imagem inválido. Deve ser uma imagem em base64.');
  }

  // Calcula tamanho aproximado em MB
  const base64Length = imageData.length - (imageData.indexOf(',') + 1);
  const sizeInMB = (base64Length * 3/4) / (1024*1024);
  
  if (sizeInMB > 5) {
    throw new Error('Imagem muito grande. O tamanho máximo permitido é 5MB.');
  }

  return true;
};

// Listar posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'username')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error('Erro ao buscar posts:', error);
    res.status(500).json({ error: 'Erro ao buscar posts' });
  }
});

// Buscar post específico
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username');
    if (!post) {
      return res.status(404).json({ error: 'Post não encontrado' });
    }
    res.json(post);
  } catch (error) {
    console.error('Erro ao buscar post:', error);
    res.status(500).json({ error: 'Erro ao buscar post' });
  }
});

// Criar post
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, content, image, tags } = req.body;

    // Validação básica
    if (!title || !content) {
      return res.status(400).json({ 
        error: 'Título e conteúdo são obrigatórios' 
      });
    }

    // Validação da imagem
    try {
      validateImage(image);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }

    const post = new Post({
      title,
      content,
      image,
      tags: tags || [],
      author: req.user.id,
      createdAt: new Date()
    });

    await post.save();
    const populatedPost = await post.populate('author', 'username');
    
    res.status(201).json(populatedPost);
  } catch (error) {
    console.error('Erro ao criar post:', error);
    res.status(500).json({ 
      error: 'Erro ao criar post',
      details: error.message 
    });
  }
});

// Atualizar post
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { title, content, image, tags } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post não encontrado' });
    }

    // Verifica se o usuário é o autor do post
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Não autorizado' });
    }

    // Validação da imagem se foi fornecida
    if (image) {
      try {
        validateImage(image);
      } catch (error) {
        return res.status(400).json({ error: error.message });
      }
    }

    post.title = title || post.title;
    post.content = content || post.content;
    post.image = image || post.image;
    post.tags = tags || post.tags;
    
    await post.save();
    const updatedPost = await post.populate('author', 'username');
    
    res.json(updatedPost);
  } catch (error) {
    console.error('Erro ao atualizar post:', error);
    res.status(500).json({ error: 'Erro ao atualizar post' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post não encontrado' });
    }

    // Verifica se o usuário é o autor do post
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Não autorizado' });
    }

    await post.deleteOne();
    res.json({ message: 'Post deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar post:', error);
    res.status(500).json({ error: 'Erro ao deletar post' });
  }
});

router.put('/:id/like', async (req, res) => {
  const post = await Post.findById(req.params.id);
  post.likes++;
  await post.save();
  res.json(post);
});

router.post('/:id/comment', async (req, res) => {
  const post = await Post.findById(req.params.id);
  post.comments.push(req.body);
  await post.save();
  res.json(post);
});

module.exports = router;
