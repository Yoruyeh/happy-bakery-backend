'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.belongsTo(models.Category, { foreignKey: 'categoryId' });
    }
  }

  Product.init(
    {
      name: DataTypes.STRING,
      sku: DataTypes.INTEGER,
      stockQuantity: DataTypes.INTEGER,
      priceRegular: DataTypes.DECIMAL(10, 2)
    },
    {
      sequelize,
      modelName: 'Product',
      tableName: 'Products',
      underscored: true,
    }
  );

  return Product;
};
