// backend/models/Post.js
const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  name: String,
  text: String,
  date: { type: Date, default: Date.now }
});

const PostSchema = new mongoose.Schema({
  title: String,
  content: String,
  image: String, // Base64 ou URL
  date: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
  comments: [CommentSchema]
});

module.exports = mongoose.model('Post', PostSchema);
