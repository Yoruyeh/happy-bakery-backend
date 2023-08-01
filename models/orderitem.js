'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {
    static associate(models) {
      OrderItem.belongsTo(models.Order, { foreignKey: 'orderId' });
      OrderItem.belongsTo(models.Product, { foreignKey: 'productId' });
    }
  }
  OrderItem.init({
    quantity: DataTypes.INTEGER,
    priceEach: DataTypes.DECIMAL(10, 2),
  }, {
    sequelize,
    modelName: 'OrderItem',
    tableName: 'OrderItems',
    underscored: true,
  });
  return OrderItem;
};