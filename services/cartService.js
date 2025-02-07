const { Cart, CartItem, Product } = require('../models');

const cartService = {
  getCart: async (user_id) => {
    const cart = await Cart.findOne({ where: { user_id } });
    if (!cart) throw new Error('no cart found');

    const cart_id = cart.dataValues.id;
    const cartItems = await CartItem.findAll({
      where: { cart_id },
      attributes: ['quantity', 'price_each'],
      include: {
        model: Product,
        attributes: ['id', 'name', 'cover'],
      },
    });

    return {
      status: 'success',
      message: cartItems.length
        ? 'cart items retrieved succeed'
        : 'no cart items found',
      cartItems: cartItems.length ? cartItems : [],
    };
  },

  postCartItem: async (user_id, product) => {
    const cart = await Cart.findOne({ where: { user_id } });
    if (!cart) throw new Error('no cart found');

    const { id, quantity, price } = product;
    const cartId = cart.dataValues.id;

    const duplicatedItem = await CartItem.findOne({
      where: { cart_id: cartId, product_id: id },
    });
    if (duplicatedItem) throw new Error('product already in cart');

    const existProduct = await Product.findOne({ where: { id } });
    if (!existProduct) throw new Error('no product found');
    if (quantity > 10) throw new Error('exceed quantity limit');

    // create in db
    const cartItem = await CartItem.create({
      cartId: cart.id,
      productId: id,
      quantity,
      priceEach: price,
    });

    // formate
    const newCartItem = {
      productId: cartItem.productId,
      quantity: cartItem.productId,
      priceEach: cartItem.priceEach,
    };

    return {
      status: 'success',
      message: 'add new cart items succeed',
      newCartItem,
    };
  },

  patchCartItem: async (user_id, product_id, quantity) => {
    try {
      const cart = await Cart.findOne({ where: { user_id } });
      if (!cart) throw new Error('no cart found');

      const cart_id = cart.dataValues.id;

      const cartItem = await CartItem.findOne({
        where: { cart_id, product_id },
      });
      if (!cartItem) throw new Error('no cart item found');

      // patch cart item
      await CartItem.update({ quantity }, { where: { cart_id, product_id } });

      return {
        status: 'success',
        message: 'patch cart item succeed',
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
      };
    }
  },

  deleteCartItem: async (user_id, product_id) => {
    const cart = await Cart.findOne({ where: { user_id } });
    if (!cart) throw new Error('no cart found');

    const cart_id = cart.dataValues.id;

    const deleteCartItem = await CartItem.findOne({
      where: { cart_id, product_id },
    });
    if (!deleteCartItem) throw new Error('no cart item found');

    // delete cart item
    await deleteCartItem.destroy();

    return {
      status: 'success',
      message: 'delete cart item succeed',
    };
  },
};

module.exports = cartService;
