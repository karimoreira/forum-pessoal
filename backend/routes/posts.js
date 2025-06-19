const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const authMiddleware = require('../middleware/authMiddleware');

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
    const { title, content, image } = req.body;

    // Log detalhado da imagem recebida
    console.log('Dados do post recebidos:');
    console.log('- Título:', title);
    console.log('- Tem imagem?', !!image);
    console.log('- Tamanho da imagem:', image?.length);
    console.log('- Início da string da imagem:', image?.substring(0, 50));

    // Validação da imagem
    if (image && !image.startsWith('data:image')) {
      return res.status(400).json({ error: 'Formato de imagem inválido' });
    }

    const post = new Post({
      title,
      content,
      image,
      author: req.user.id,
      createdAt: new Date()
    });

    await post.save();
    
    const populatedPost = await post.populate('author', 'username');
    
    // Log do post salvo
    console.log('Post salvo com sucesso:');
    console.log('- ID:', populatedPost._id);
    console.log('- Tem imagem salva?', !!populatedPost.image);
    console.log('- Tamanho da imagem salva:', populatedPost.image?.length);

    res.status(201).json(populatedPost);
  } catch (error) {
    console.error('Erro detalhado ao criar post:', error);
    res.status(500).json({ error: 'Erro ao criar post' });
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
