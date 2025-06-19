// backend/models/Post.js
const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  name: String,
  text: String,
  date: { type: Date, default: Date.now }
});

const ImageSchema = new mongoose.Schema({
  url: { type: String },
  alt: { type: String },
  caption: { type: String },
  dimensions: {
    width: Number,
    height: Number
  }
});

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  image: ImageSchema,
  author: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: { 
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  tags: [{ type: String }],
  likes: { type: Number, default: 0 },
  comments: [CommentSchema],
  status: {
    type: String,
    enum: ['rascunho', 'publicado'],
    default: 'publicado'
  }
});

// Middleware para atualizar updatedAt
PostSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Post', PostSchema);
