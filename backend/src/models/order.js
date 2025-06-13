const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Order extends Model {}
  Order.init({
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    address_id: { type: DataTypes.INTEGER, allowNull: false },
    delivery_person_id: { type: DataTypes.INTEGER },
    status: { type: DataTypes.ENUM('recebido', 'em_preparo', 'pronto_para_entrega', 'em_rota', 'entregue', 'cancelado'), defaultValue: 'recebido' },
    total_price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  }, {
    sequelize,
    modelName: 'Order',
    tableName: 'orders',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return Order;
};