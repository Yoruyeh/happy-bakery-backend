
'use strict'
const { faker } = require('@faker-js/faker')
const { getRandomDate } = require('../helpers/date-helper')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users WHERE is_admin = false;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    await queryInterface.bulkInsert('Orders',
      Array.from({ length: 500 }, () => {
        let randomDate = getRandomDate()
        return {
          user_id: users[Math.floor(Math.random() * users.length)].id,
          status: faker.helpers.arrayElement(['pending', 'cancel', 'delivered']),
          first_name: faker.person.firstName(),
          last_name: faker.person.lastName(),
          email: faker.internet.email(),
          phone: faker.phone.number('09########'),
          address: faker.location.city(),
          payment_method: faker.helpers.arrayElement(['PayPal', 'ECPAY', 'NewebPay']),
          shipping_method: faker.helpers.arrayElement(['standard', 'store']),
          order_date: randomDate,
          created_at: randomDate,
          updated_at: randomDate,
        }
      })
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Orders', {})
  }
}