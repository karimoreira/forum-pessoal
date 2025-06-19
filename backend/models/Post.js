// backend/models/Post.js
const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  name: String,
  text: String,
  date: { type: Date, default: Date.now }
});

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String },
  author: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: { 
    type: Date,
    default: Date.now
  },
  likes: { type: Number, default: 0 },
  comments: [CommentSchema]
});

module.exports = mongoose.model('Post', PostSchema);
