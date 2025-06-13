'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/database.js')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Definindo as associações entre os modelos
const { User, Address, Order, Product, OrderItem } = db;

// User <-> Address (Um usuário tem muitos endereços)
User.hasMany(Address, { foreignKey: 'user_id', as: 'Addresses' });
Address.belongsTo(User, { foreignKey: 'user_id', as: 'User' });

// User <-> Order (Um usuário faz muitos pedidos)
User.hasMany(Order, { foreignKey: 'user_id', as: 'CustomerOrders' });
Order.belongsTo(User, { foreignKey: 'user_id', as: 'Customer' });

// Order <-> DeliveryPerson (User) (Um pedido tem um entregador)
Order.belongsTo(User, { foreignKey: 'delivery_person_id', as: 'DeliveryPerson' });

// Order <-> Address (Um pedido é entregue em um endereço)
Order.belongsTo(Address, { foreignKey: 'address_id', as: 'DeliveryAddress' });

// Order <-> OrderItem <-> Product (Relação Muitos-para-Muitos)
Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'Items' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

Product.hasMany(OrderItem, { foreignKey: 'product_id' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id' });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;