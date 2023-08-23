const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { User, Product, Category, ProductImage } = require('../models')
const { CError } = require('../middleware/error-handler')

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

  putPassword: async (id, data) => {
    const { currentPW, newPW, confirmPW } = data

    const user = await User.findByPk(id)
    if (!user) throw new CError('Admin not found', 404)
    if (!bcrypt.compareSync(currentPW, user.password)) throw new CError('Wrong password', 403)
    if (newPW !== confirmPW) throw new CError('Passwords do not match', 403)

    const hash = await bcrypt.hash(newPW, 10)
    await user.update({ password: hash })

    return {
      status: 'success',
      message: 'Admin password change succeed'
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
  },

  postProduct: async (productInfo, productImages) => {
    const { name, description, category, cover, sku, quantity, priceRegular, priceSale } = productInfo

    // check category
    const DEFAULT_CATEGORY_ID = 1
    let categoryId = DEFAULT_CATEGORY_ID
    const categoryData = await Category.findOne({
      where: { name: category }
    })
    if (categoryData) {
      categoryId = categoryData.id
    } else {
      throw new CError(`cannot find category ${category}`, 400)
    }

    // create product
    const newProduct = await Product.create({
      name,
      categoryId,
      cover,
      description,
      sku,
      stockQuantity: quantity,
      priceRegular,
      priceSale
    })

    // create product image
    const productId = newProduct.id
    const newImages = await Promise.all(
      productImages.map(async (image) => {
        return ProductImage.create({
          productId,
          name: image.name,
          imagePath: image.link,
        })
      }))

    // return data
    if (newProduct !== null || newImages !== null) {
      return {
        status: 'success',
        message: 'create product succeed',
        newProduct,
        newImages
      }
    } else {
      return {
        status: 'error',
        message: 'create product fail'
      }
    }
  }
}

module.exports = adminService