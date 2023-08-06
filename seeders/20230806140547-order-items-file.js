// PENDING: price_each

'use strict'
const { faker } = require('@faker-js/faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const orders = await queryInterface.sequelize.query(
      'SELECT id FROM Orders;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const products = await queryInterface.sequelize.query(
      'SELECT id FROM Products;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    await queryInterface.bulkInsert('OrderItems',
      Array.from({ length: 300 }, () => ({
        order_id: orders[Math.floor(Math.random() * orders.length)].id,
        product_id: products[Math.floor(Math.random() * products.length)].id,
        quantity: faker.number.int({ min: 1, max: 4 }),
        created_at: new Date(),
        updated_at: new Date(),
      }))
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('OrderItems', {})
  }
}
