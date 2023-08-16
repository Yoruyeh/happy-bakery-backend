'use strict'
const { faker } = require('@faker-js/faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const products = await queryInterface.sequelize.query(
      'SELECT id FROM Products;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    await queryInterface.bulkInsert('ProductImages',
      Array.from({ length: 100 }, () => ({
        product_id: products[Math.floor(Math.random() * products.length)].id,
        name: faker.word.adjective(),
        image_path: faker.image.urlLoremFlickr({ category: 'food' }),
        is_display: faker.helpers.arrayElement([0, 1]),
        created_at: new Date(),
        updated_at: new Date(),
      }))
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('ProductImages', {})
  }
}
