const orderService = require('../services/orderService')
const { CError } = require('../middleware/error-handler')
const { isValidateId, isValidItem } = require('../helpers/validationHelper')

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
      const { orderItems, shipment, payment } = req.body
      if (!orderItems || !shipment || !payment) throw new CError('invalid input', 400)
      const isValidOrderItems = orderItems.every(isValidItem)
      if (!isValidOrderItems) throw new CError('invalid orderItems', 400)

      // tbc
      const { email, first_name, last_name, address, phone, shipping_method } = shipment
      const { payment_method } = payment

      const { status, message, order } = await orderService.postOrder(orderItems, shipment, payment)
      res.json({ status, message, order })
    } catch (error) {
      next(error)
    }
  }

}
module.exports = orderController