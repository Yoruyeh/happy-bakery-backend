// PENDING: sku

'use strict'
const SEED_PRODUCT = require('./product.json')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    SEED_PRODUCT.map(product => {
      return queryInterface.bulkInsert('Products', [
        {
          name: product.name,
          category_id: product.category_id,
          cover: product.cover,
          stock_quantity: product.stock_quantity,
          price_regular: product.price_regular,
          price_sale: product.price_sale,
          description: product.description,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ])
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Products', {})
  }
}