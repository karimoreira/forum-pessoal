require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express(); 

const postRoutes = require('./routes/posts');
const authRoutes = require('./routes/auth');

app.use(cors());
app.use(express.json());

app.use('/api/posts', postRoutes);
app.use('/api/auth', authRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Conectado ao MongoDB');
    app.listen(4000, () => console.log('Servidor rodando na porta 4000'));
  })
  .catch(err => console.error('Erro ao conectar no MongoDB:', err));
