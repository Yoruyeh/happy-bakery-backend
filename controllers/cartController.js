const cartService = require('../services/cartService')
const { CError } = require('../middleware/error-handler')

const cartController = {

  getCart: async (req, res, next) => {
    try {
      if (!req.user) throw new CError('User data not found', 400)
      if (!req.isAuthenticated()) throw new CError('User not authenticated', 401)
      if (req.user.isAdmin === true) throw new CError('Admin not allowed', 400)

      const currentUserId = req.user.id
      console.log(currentUserId)

      const { status, message, cartItems } = await cartService.getCart(currentUserId)
      res.json({ status, message, cartItems })
    } catch (error) {
      next(error)
    }
  }
}
module.exports = cartController