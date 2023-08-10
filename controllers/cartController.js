const cartService = require('../services/cartService')
const { CError } = require('../middleware/error-handler')
const { isValidItem } = require('../helpers/validationHelper')

const cartController = {

  getCart: async (req, res, next) => {
    try {
      if (!req.user) throw new CError('User data not found', 400)
      if (!req.isAuthenticated()) throw new CError('User not authenticated', 401)
      if (req.user.isAdmin === true) throw new CError('Admin not allowed', 400)

      const currentUserId = req.user.id

      const { status, message, cartItems } = await cartService.getCart(currentUserId)
      res.json({ status, message, cartItems })
    } catch (error) {
      next(error)
    }
  },

  postCartItem: async (req, res, next) => {
    try {
      const user = req.user
      if (!user) throw new CError('User data not found', 400)
      if (!req.isAuthenticated()) throw new CError('User not authenticated', 401)
      if (user.isAdmin) throw new CError('Admin not allowed', 400)

      const currentUserId = user.id
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
  }

}
module.exports = cartController