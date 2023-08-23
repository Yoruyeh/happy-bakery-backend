const orderService = require('../services/orderService')
const validator = require('validator')
const { CError } = require('../middleware/error-handler')
const { isValidateId, isValidPositiveInteger, isValidItem } = require('../helpers/validation-helper')

const orderController = {

  getOrder: async (req, res, next) => {
    try {
      const { id } = req.params
      if (!id || !isValidateId(id)) throw new CError('invalid order id', 400)

      const { status, message, order } = await orderService.getOrder(id)
      res.json({ status, message, order })
    } catch (error) {
      next(error)
    }
  },

  postOrder: async (req, res, next) => {
    try {
      // user valid
      if (!req.user) throw new CError('User data not found', 400)
      if (!req.isAuthenticated()) throw new CError('User not authenticated', 401)
      if (req.user.isAdmin === true) throw new CError('Admin not allowed', 400)
      const userId = req.user.id

      // input valid
      const { orderItems, total, shipment, payment } = req.body
      if (!orderItems || !total || !shipment || !payment) throw new CError('invalid input', 400)

      // order item valid
      const isValidOrderItems = orderItems.every(isValidItem)
      if (!isValidOrderItems) throw new CError('invalid orderItems', 400)

      // total valid
      if (!isValidPositiveInteger(total)) throw new CError('invalid total', 400)

      // shipment valid
      const { email, firstName, lastName, address, phone, shippingMethod } = shipment
      if (!email || !validator.isEmail(email)) throw new CError('invalid email', 400)
      if (!firstName || !lastName) throw new CError('name is required', 400)
      if (!address || !phone || phone.length > 10 || phone.length < 8) throw new CError('invalid address or phone', 400)
      if (!['standard', 'store'].includes(shippingMethod)) throw new CError('invalid shipping method', 400)

      // payment valid
      const { paymentMethod } = payment
      if (!['NewebPay', 'ECPAY', 'PayPal', 'credit', 'transfer', 'LINE'].includes(paymentMethod)) throw new CError('invalid payment method', 400)

      const { status, message, newOrder, newOrderItem } = await orderService.postOrder(userId, orderItems, total, shipment, payment)
      res.json({ status, message, newOrder, newOrderItem })
    } catch (error) {
      next(error)
    }
  }

}
module.exports = orderController