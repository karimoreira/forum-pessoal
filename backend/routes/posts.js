const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const authMiddleware = require('../middleware/authMiddleware');


router.get('/', async (req, res) => {
  const posts = await Post.find().sort({ date: -1 });
  res.json(posts);
});


router.post('/', authMiddleware, async (req, res) => {
  const { title, content, image } = req.body;

  const post = new Post({
    title,
    content,
    image,
    date: new Date(),
    likes: 0,
    comments: [],
  });

  await post.save();
  res.status(201).json(post);
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
