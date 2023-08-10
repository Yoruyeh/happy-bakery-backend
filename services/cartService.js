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
  },

  postCartItem: async (user_id, product) => {
    const cart = await Cart.findOne({ where: { user_id } })
    if (!cart) throw new Error('no cart found')

    const { id, quantity, price } = product
    const cartId = cart.dataValues.id

    const duplicatedItem = await CartItem.findOne({ where: { cart_id: cartId, product_id: id } })
    if (duplicatedItem) throw new Error('product already in cart')

    const existProduct = await Product.findOne({ where: { id } })
    if (!existProduct) throw new Error('no product found')
    if (quantity > 10) throw new Error('exceed quantity limit')

    // create in db
    const cartItem = await CartItem.create({
      cartId: cart.id,
      productId: id,
      quantity,
      priceEach: price
    })

    // formate
    const newCartItem = {
      productId: cartItem.productId,
      quantity: cartItem.productId,
      priceEach: cartItem.priceEach
    }

    return {
      status: 'success',
      message: 'add new cart items succeed',
      newCartItem
    }
  }

}

module.exports = cartService