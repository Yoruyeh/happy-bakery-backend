'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }

  Order.init({
    name: DataTypes.STRING,
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
