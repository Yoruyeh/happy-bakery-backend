'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ProductImage extends Model {
    static associate(models) {
      ProductImage.belongsTo(models.Product, { foreignKey: 'productId' });
    }
  }

  ProductImage.init({
    name: DataTypes.STRING,
    imagePath: DataTypes.STRING,
    isDisplay: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'ProductImage',
    underscored: true,
  });

  return ProductImage;
};
