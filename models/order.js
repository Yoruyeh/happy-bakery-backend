'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.User, { foreignKey: 'userId' })
      Order.hasMany(models.OrderItem, { foreignKey: 'orderId' })
    }
  }

  Order.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
    orderDate: DataTypes.DATE,
    totalPrice: DataTypes.DECIMAL(10, 2),
    status: DataTypes.STRING,
    paymentMethod: DataTypes.STRING,
    shippingMethod: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Order',
    tableName: 'Orders',
    underscored: true,
  });

  return Order;
};
