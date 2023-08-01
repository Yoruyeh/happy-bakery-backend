const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    static associate(models) {
      Cart.belongsTo(models.User, { foreignKey: 'userId' });
      Cart.hasMany(models.CartItem);
    }
  }
  Cart.init(
    {
    },
    {
      sequelize,
      modelName: 'Cart',
      tableName: 'Carts',
      underscored: true,
    }
  );

  return Cart;
};
