require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const compression = require('compression');

const app = express(); 

const postRoutes = require('./routes/posts');
const authRoutes = require('./routes/auth');

// Middleware para compressão de respostas
app.use(compression());

// Configuração do CORS
app.use(cors());

// Aumentar limite de payload para 5MB
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

app.use('/api/posts', postRoutes);
app.use('/api/auth', authRoutes);

// Middleware para logging de requisições
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Conectado ao MongoDB');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
  })
  .catch(err => {
    console.error('Erro ao conectar no MongoDB:', err);
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
  });

// Middleware de erro global
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  res.status(500).json({ 
    error: 'Erro interno do servidor',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});
