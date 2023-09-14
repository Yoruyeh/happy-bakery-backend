'use strict'
const { faker } = require('@faker-js/faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const orders = await queryInterface.sequelize.query(
      'SELECT id, created_at, updated_at FROM Orders;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const products = await queryInterface.sequelize.query(
      'SELECT id, price_regular FROM Products;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const orderItemsData = Array.from({ length: 2500 }, () => {
      const product = products[Math.floor(Math.random() * products.length)]
      const order = orders[Math.floor(Math.random() * orders.length)]
      return {
        order_id: order.id,
        product_id: product.id,
        price_each: product.price_regular,
        quantity: faker.number.int({ min: 1, max: 4 }),
        created_at: order.created_at,
        updated_at: order.updated_at
      }
    })

    await queryInterface.bulkInsert('OrderItems', orderItemsData)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('OrderItems', null, {})
  }
}