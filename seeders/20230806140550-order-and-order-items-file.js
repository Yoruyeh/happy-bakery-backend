'use strict'
const { Order, OrderItem } = require('../models')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const orders = await Order.findAll()

    for (const order of orders) {
      const orderItems = await OrderItem.findAll({
        where: { order_id: order.id }
      })

      let totalOrderPrice = 0

      for (const orderItem of orderItems) {
        let priceEach = Number(orderItem.dataValues.priceEach)
        const itemTotalPrice = orderItem.quantity * priceEach
        totalOrderPrice += itemTotalPrice
      }

      await Order.update(
        { totalPrice: totalOrderPrice },
        { where: { id: order.id } }
      )
    }
  },
  down: async (queryInterface, Sequelize) => {
  }
}
