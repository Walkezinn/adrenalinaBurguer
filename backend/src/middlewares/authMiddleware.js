const jwt = require('jsonwebtoken');
const { User } = require('../models');

exports.protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findByPk(decoded.id, { attributes: { exclude: ['password'] } });
      if (!req.user) {
        return res.status(401).json({ message: 'Usuário não encontrado.' });
      }
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Não autorizado, token inválido.' });
    }
  }
  if (!token) {
    return res.status(401).json({ message: 'Não autorizado, sem token.' });
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Acesso negado. Rota exclusiva para administradores.' });
  }
};

exports.isEntregador = (req, res, next) => {
    if (req.user && req.user.role === 'entregador') {
      next();
    } else {
      res.status(403).json({ message: 'Acesso negado. Rota exclusiva para entregadores.' });
    }
  };