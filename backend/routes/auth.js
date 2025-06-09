const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = 'secretoforte123'; 

router.post('/register', async (req, res) => {
  const { email, password } = req.body; 

  console.log('Dados recebidos no cadastro:', { email, password });

  const existingUser = await User.findOne({ email }); 

  if (existingUser) {
    return res.status(400).json({ error: 'Usuário já existe' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ email, password: hashedPassword });

  await user.save();

  res.status(201).json({ message: 'Usuário registrado com sucesso' });
});


// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: 'Credenciais inválidas' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ error: 'Credenciais inválidas' });

  const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

  res.json({ token });
});

module.exports = router;



