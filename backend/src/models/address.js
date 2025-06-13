const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Address extends Model {}
  Address.init({
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    street: { type: DataTypes.STRING, allowNull: false },
    number: { type: DataTypes.STRING, allowNull: false },
    neighborhood: { type: DataTypes.STRING, allowNull: false },
    city: { type: DataTypes.STRING, allowNull: false },
    state: { type: DataTypes.STRING(2), allowNull: false },
    zip_code: { type: DataTypes.STRING(10), allowNull: false },
    is_default: { type: DataTypes.BOOLEAN, defaultValue: false },
  }, {
    sequelize,
    modelName: 'Address',
    tableName: 'addresses',
    timestamps: false,
  });
  return Address;
};