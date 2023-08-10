const { Cart, CartItem, Product } = require('../models')

const cartService = {

  getCart: async (user_id) => {
    const cart = await Cart.findOne({ where: { user_id } })
    if (!cart) throw new Error('no cart found')

    const cart_id = cart.dataValues.id
    const cartItems = await CartItem.findAll({
      where: { cart_id },
      attributes: ['quantity', 'price_each'],
      include: {
        model: Product,
        attributes: ['name', 'cover']
      }
    })

    if (cartItems.length > 0) {
      return {
        status: 'success',
        message: 'cart items retrieved succeed',
        cartItems
      }
    } else {
      return {
        status: 'success',
        message: 'no cart items found'
      }
    }
  }
}

module.exports = cartService