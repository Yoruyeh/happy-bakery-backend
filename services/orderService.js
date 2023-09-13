const sequelize = require('sequelize')
const { Order, OrderItem, Product, Cart, CartItem } = require('../models')
const { calShippingFee } = require("../helpers/fee-helper")

const orderService = {

  getOrder: async (id) => {

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
    const shipping_fee = calShippingFee(order.dataValues.shipping_method)
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

    // check stock and create order items
    const orderItemsWithStockCheck = await orderService.checkStockAndCreateOrderItems(orderItems)

    // create order
    const newOrder = await orderService.createOrder(userId, firstName, lastName, email, phone, address, total, paymentMethod, shippingMethod)

    // deduct stock
    await orderService.deductStockQuantity(orderItemsWithStockCheck)

    // clear cart
    await orderService.clearCart(userId)

    if (newOrder !== null) {
      return {
        status: 'success',
        message: 'Create order succeed',
        newOrder,
        newOrderItem: orderItemsWithStockCheck
      }
    } else {
      return {
        status: 'error',
        message: 'Create order fail'
      }
    }
  },

  checkStockAndCreateOrderItems: async (orderItems) => {
    const orderItemsWithStockCheck = []
    for (const item of orderItems) {
      const product = await Product.findByPk(item.id)
      if (!product) {
        throw new Error(`Product with ID ${item.id} not found.`)
      }
      if (item.quantity > product.stockQuantity) {
        throw new Error(`Not enough stock for product ${product.name}.`)
      }

      orderItemsWithStockCheck.push({
        productId: item.id,
        quantity: item.quantity,
        priceEach: item.price
      })
    }
    return orderItemsWithStockCheck
  },

  createOrder: async (userId, firstName, lastName, email, phone, address, total, paymentMethod, shippingMethod) => {
    return await Order.create({
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
      shippingMethod
    })
  },

  deductStockQuantity: async (orderItems) => {
    for (const item of orderItems) {
      const product = await Product.findByPk(item.productId)
      if (product) {
        const newStockQuantity = product.stockQuantity - item.quantity
        await product.update({ stockQuantity: newStockQuantity })
      }
    }
  },

  clearCart: async (userId) => {
    const cart = await Cart.findOne({ where: { userId } })
    if (cart) {
      const cartId = cart.dataValues.id
      await CartItem.destroy({ where: { cartId: cartId } })
    }
  }

}

module.exports = orderService