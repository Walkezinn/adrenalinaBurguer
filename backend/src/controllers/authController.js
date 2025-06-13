const { User } = require('../models');
const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body; // Role pode ser enviado opcionalmente
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'Este e-mail já está em uso.' });
    }
    const user = await User.create({ name, email, password, role });
    res.status(201).json({
      message: 'Usuário registrado com sucesso!',
      userId: user.id
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor', error: error.message });
  }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user || !user.validPassword(password)) {
            return res.status(401).json({ message: 'E-mail ou senha inválidos.' });
        }
        
        const token = generateToken(user.id, user.role);
        res.status(200).json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor', error: error.message });
    }
}