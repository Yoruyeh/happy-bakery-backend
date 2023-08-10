const sequelize = require('sequelize')
const { Order, OrderItem, Product } = require('../models')

const orderService = {

  getOrder: async (id) => {

    const shippingFeeMap = {
      store: 0,
      standard: 60,
    }

    const order = await Order.findByPk(id, {
      attributes: [
        'id',
        [sequelize.literal('DATE(order_date)'), 'order_date'],
        'total_price',
        'status',
        [sequelize.fn('CONCAT', sequelize.col('first_name'), ' ', sequelize.col('last_name')), 'customer_name'],
        'email',
        'address',
        'phone',
        'shipping_method',
        'payment_method',
        // payment status
      ],
      include: {
        model: OrderItem,
        attributes: ['quantity', 'price_each'],
        include: {
          model: Product,
          attributes: ['name', 'cover']
        }
      }
    })

    const item_count = order.OrderItems.length
    const shipping_fee = shippingFeeMap[order.shipping_method] || 0
    order.setDataValue('item_count', item_count)
    order.setDataValue('shipping_fee', shipping_fee)

    if (order !== null) {
      return {
        status: 'success',
        message: 'order retrieved succeed',
        order
      }
    } else {
      return {
        status: 'success',
        message: 'no order found'
      }
    }
  }
}

module.exports = orderService