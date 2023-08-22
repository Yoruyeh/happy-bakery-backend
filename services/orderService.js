const sequelize = require('sequelize')
const { Order, OrderItem, Product, Cart, CartItem } = require('../models')

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
  },

  postOrder: async (userId, orderItems, total, shipment, payment) => {
    const { email, firstName, lastName, address, phone, shippingMethod } = shipment
    const { paymentMethod } = payment

    // tbc: should check stock
    // create order
    const newOrder = await Order.create({
      userId,
      status: 'pending',
      firstName,
      lastName,
      email,
      phone,
      address,
      orderDate: new Date(),
      totalPrice: total,
      paymentMethod,
      shippingMethod,
    })

    // create order items
    const formattedOrderItems = orderItems.map(item => {
      return {
        productId: item.id,
        quantity: item.quantity,
        priceEach: item.price
      }
    })
    const orderId = newOrder.dataValues.id
    formattedOrderItems.forEach(item => {
      item.orderId = orderId;
    })
    const newOrderItem = await OrderItem.bulkCreate(formattedOrderItems)

    // clear cart
    const cart = await Cart.findOne({ where: { userId } })
    const cartId = cart.dataValues.id
    await CartItem.destroy({ where: { cartId: cartId } })

    // return data
    if (newOrder !== null || newOrderItem !== null) {
      return {
        status: 'success',
        message: 'create order succeed',
        newOrder,
        newOrderItem
      }
    } else {
      return {
        status: 'error',
        message: 'create order fail'
      }
    }
  }
}

module.exports = orderService