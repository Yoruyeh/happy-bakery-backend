const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { User, Product, Category, ProductImage } = require('../models')

const adminService = {
  signIn: async (email, password) => {
    const user = await User.findOne({ where: { email } })
    if (!user) {
      const error = new Error('Admin not found')
      error.status = 404
      throw error
    }
    if (!bcrypt.compareSync(password, user.password)) {
      const error = new Error('Wrong password')
      error.status = 403
      throw error
    }
    if (user.isAdmin == false) {
      const error = new Error('Access forbidden')
      error.status = 403
      throw error
    }
    const payload = { id: user.id }
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' })
    return {
      status: 'success',
      message: 'login succeed',
      token,
      user: {
        id: user.id,
        email: user.email,
        admin: user.isAdmin
      }
    }
  },

  getProduct: async (id) => {
    const product = await Product.findByPk(id, {
      attributes: [
        'id',
        'name',
        'cover',
        'description',
        'sku',
        'stock_quantity',
        'price_regular',
        'price_sale'
      ],
      include: [
        {
          model: Category,
          attributes: ['id', 'name'],
        },
        {
          model: ProductImage,
          attributes: ['name', 'image_path', 'is_display'],
          required: false
        }
      ],
      order: [
        [ProductImage, 'is_display', 'DESC']
      ]
    })
    if (product !== null) {
      return {
        status: 'success',
        message: 'product retrieved succeed',
        product
      }
    } else {
      return {
        status: 'success',
        message: 'no product found'
      }
    }
  }
}

module.exports = adminService