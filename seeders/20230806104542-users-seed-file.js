'use strict'
const bcrypt = require('bcryptjs')
const { faker } = require('@faker-js/faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // create 3 users, only root is admin
    const users = []
    users.push({
      first_name: 'Bread',
      last_name: 'Master',
      email: 'root@example.com',
      password: await bcrypt.hash('12345678', 10),
      is_admin: true,
      created_at: new Date(),
      updated_at: new Date()
    })
    for (let i = 1; i <= 3; i++) {
      users.push({
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        gender: faker.helpers.arrayElement(['male', 'female', 'other']),
        email: 'user' + i + '@example.com',
        phone: faker.phone.number('09##-###-###'),
        password: await bcrypt.hash('12345678', 10),
        address: faker.location.city(),
        is_admin: false,
        created_at: new Date(),
        updated_at: new Date()
      })
    }
    await queryInterface.bulkInsert('Users', users, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
}