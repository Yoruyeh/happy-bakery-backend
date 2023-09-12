// PENDING: price_each

'use strict'
const { faker } = require('@faker-js/faker')
const { Product } = require('../models')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const carts = await queryInterface.sequelize.query(
      'SELECT id FROM Carts;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const products = await Product.findAll({
      attributes: ['id', 'price_regular'],
    })
    await queryInterface.bulkInsert('CartItems',
      Array.from({ length: 15 }, () => {
        const randomProduct = products[Math.floor(Math.random() * products.length)]
        const price_regular = randomProduct.dataValues.price_regular
        return {
          cart_id: carts[Math.floor(Math.random() * carts.length)].id,
          product_id: randomProduct.id,
          quantity: faker.number.int({ min: 1, max: 4 }),
          price_each: price_regular,
          created_at: new Date(),
          updated_at: new Date(),
        }
      })
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('CartItems', {})
  }
}
