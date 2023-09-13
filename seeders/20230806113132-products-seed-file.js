// PENDING: sku

'use strict'
const { faker } = require('@faker-js/faker')
const SEED_PRODUCT = require('./product.json')
const { Product, ProductImage } = require('../models')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    for (const productData of SEED_PRODUCT) {
      const product = await Product.create({
        name: productData.name,
        categoryId: productData.category_id,
        cover: productData.cover,
        stockQuantity: productData.stock_quantity,
        priceRegular: productData.price_regular,
        priceSale: productData.price_sale,
        description: productData.description,
        created_at: new Date(),
        updated_at: new Date(),
      })
      const productId = product.id
      const productImages = productData.images
    
      for (const image of productImages) {
        await ProductImage.create({
          productId: productId,
          name: faker.word.adjective(),
          imagePath: image.image_path,
          is_display: image.is_display
        })
      }
    }
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Products', {})
  }
}