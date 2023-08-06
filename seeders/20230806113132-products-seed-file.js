// PENDING: sku

'use strict'
const { faker } = require('@faker-js/faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const categories = await queryInterface.sequelize.query(
      'SELECT id FROM Categories;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    await queryInterface.bulkInsert('Products',
      Array.from({ length: 50 }, () => ({
        name: faker.commerce.productName(),
        category_id: categories[Math.floor(Math.random() * categories.length)].id,
        stock_quantity: faker.number.int({ min: 100, max: 1000 }),
        price_regular: faker.commerce.price({ min: 150, max: 300, dec: 0 }),
        price_sale: faker.commerce.price({ min: 50, max: 100, dec: 0 }),
        description: faker.commerce.productDescription(),
        created_at: new Date(),
        updated_at: new Date(),
      }))
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Products', {})
  }
}
