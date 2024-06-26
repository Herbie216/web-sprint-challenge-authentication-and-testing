const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Users = require('./auth-users-model'); 

const secret = process.env.SECRET_KEY || 'shh';

router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'username and password required' });
  }

  try {
    const user = await Users.findByUsername(username);
    if (user) {
      return res.status(409).json({ message: 'username taken' });
    }

    const hash = await bcrypt.hash(password, 8);
    const newUser = await Users.add({ username, password: hash });

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'username and password required' });
  }

  try {
    const user = await Users.findByUsername(username);
    if (!user) {
      return res.status(401).json({ message: 'invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '1h' });
    res.json({ message: `welcome, ${username}`, token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
});

module.exports = router;
