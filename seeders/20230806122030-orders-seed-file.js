// PENDING: order_data, total_amount

'use strict'
const { faker } = require('@faker-js/faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users WHERE is_admin = false;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    await queryInterface.bulkInsert('Orders',
      Array.from({ length: 100 }, () => ({
        user_id: users[Math.floor(Math.random() * users.length)].id,
        status: faker.helpers.arrayElement(['pending', 'cancel', 'delivered']),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number('09##-###-###'),
        address: faker.location.city(),
        payment_method: faker.helpers.arrayElement(['PayPal', 'ECPAY', 'NewebPay']),
        shipping_method: faker.helpers.arrayElement(['standard', 'store']),
        created_at: new Date(),
        updated_at: new Date(),
      }))
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Orders', {})
  }
}
