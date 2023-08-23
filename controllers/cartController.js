const cartService = require('../services/cartService')
const { CError } = require('../middleware/error-handler')
const { isValidItem, isValidateId, isValidPositiveInteger } = require('../helpers/validation-helper')

const cartController = {

  getCart: async (req, res, next) => {
    try {
      const currentUserId = req.user.id

      const { status, message, cartItems } = await cartService.getCart(currentUserId)
      res.json({ status, message, cartItems })
    } catch (error) {
      next(error)
    }
  },

  postCartItem: async (req, res, next) => {
    try {
      const currentUserId = req.user.id
      const product = req.body
      const requiredKeys = ['id', 'quantity', 'price']

      if (!requiredKeys.every(key => key in product)) {
        throw new CError('id, quantity, price are required', 400)
      }
      if (!isValidItem(product)) {
        throw new CError('invalid cart item', 400)
      }

      const { status, message, newCartItem } = await cartService.postCartItem(currentUserId, product)
      res.json({ status, message, newCartItem })
    } catch (error) {
      next(error)
    }
  },

  patchCartItem: async (req, res, next) => {
    try {
      const currentUserId = req.user.id
      const { productId } = req.params
      const { quantity } = req.body
      if (!isValidateId(productId)) throw new CError('invalid product id', 400)
      if (!isValidPositiveInteger(quantity)) throw new CError('invalid quantity', 400)
      if (quantity > 10) throw new Error('exceed quantity limit')

      const { status, message } = await cartService.patchCartItem(currentUserId, productId, quantity)
      res.json({ status, message })
    } catch (error) {
      next(error)
    }
  },

  deleteCartItem: async (req, res, next) => {
    try {
      const currentUserId = req.user.id
      const { productId } = req.params

      const { status, message } = await cartService.deleteCartItem(currentUserId, productId)
      res.json({ status, message })
    } catch (error) {
      next(error)
    }
  }

}
module.exports = cartController