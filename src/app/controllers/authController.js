const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const authConfig = require('../../config/auth');
const User = require('../models/user');

const router = express.Router();

function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400,
  });
}

router.get('/:phone', async (req, res) => {
  const { phone } = req.params;

  try {
    const user = await User.findOne({ phone });

    if (!user)
      return res.status(400).send({ error: 'User not found' });

    return res.send();
  } catch (e) {
    return res.status(400).send({ error: 'Search user failed' });
  }
})

router.post('/register', async (req, res) => {
  const { phone } = req.body;

  try {
    if (await User.findOne({ phone }))
      return res.status(400).send({ error: 'User already exists' });

    const user = await User.create(req.body);

    user.password = undefined;

    return res.send({
      user,
      token: generateToken({ id: user.id }),
    });
  } catch (e) {
    return res.status(400).send({ error: 'Registration failed' });
  }
});

router.post('/authenticate', async (req, res) => {
  const { phone, password } = req.body;

  try {
    const user = await User.findOne({ phone }).select('+password');

    if (!user)
      return res.status(400).send({ error: 'User not found' });

    if (!await bcrypt.compare(password, user.password))
      return res.status(400).send({ error: 'Invalid password' });

    user.password = undefined;

    return res.send({
      user,
      token: generateToken({ id: user.id }),
    });
  } catch (e) {
    return res.status(400).send({ error: 'Authentication failed' });
  }
});

module.exports = app => app.use('/auth', router);
