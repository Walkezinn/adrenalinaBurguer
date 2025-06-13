// Carrega as variáveis de ambiente do arquivo .env
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const db = require('./src/models'); // Importa o objeto db do index.js dos models

// Importa as rotas
const authRoutes = require('./src/routes/authRoutes');
const productRoutes = require('./src/routes/productRoutes');
const orderRoutes = require('./src/routes/orderRoutes');

const app = express();

// Middlewares
app.use(cors()); // Permite requisições de diferentes origens (do seu frontend)
app.use(express.json()); // Permite que o express entenda JSON no corpo das requisições

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Rota de teste
app.get('/api', (req, res) => {
  res.send('API Adrenalina Burguer está no ar!');
});

const PORT = process.env.PORT || 5000;

// Sincroniza o banco de dados e inicia o servidor
db.sequelize.authenticate()
  .then(() => {
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
    // db.sequelize.sync(); // Descomente para sincronizar os modelos com o banco (cria tabelas se não existirem)
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Não foi possível conectar ao banco de dados:', err);
  });