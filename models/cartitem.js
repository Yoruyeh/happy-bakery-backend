const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CartItem extends Model {
    static associate(models) {
      CartItem.belongsTo(models.Cart, { foreignKey: 'cartId' });
      CartItem.belongsTo(models.Product, { foreignKey: 'productId' });
    }
  }
  CartItem.init(
    {
      quantity: DataTypes.INTEGER,
      priceEach: DataTypes.DECIMAL(10, 2),
    },
    {
      sequelize,
      modelName: 'CartItem',
      tableName: 'CartItems',
      underscored: true,
    }
  );

  return CartItem;
};
