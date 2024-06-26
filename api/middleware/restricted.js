const jwt = require('jsonwebtoken');
const secret = process.env.SECRET_KEY || 'shh';

module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'token required' });
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'token invalid' });
    }

    req.decodedJwt = decoded;
    next();
  });
};
