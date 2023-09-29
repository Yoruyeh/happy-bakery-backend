const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const percentChange = require('percent-change')
const { Op } = require('sequelize')
const { sequelize, User, Product, Category, ProductImage, Order, OrderItem } = require('../models')
const productService = require('./productService')
const { CError } = require('../middleware/error-handler')
const { calShippingFee } = require('../helpers/fee-helper')
const { dateFormateMonth, convertToOneYearAgo, getPreviousYear } = require('../helpers/date-helper')

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

  getAdminSetting: async (id) => {
    return User.findByPk(id, {
      attributes: [
        'id',
        'firstName',
        'lastName',
        'email',
      ],
      raw: true,
      nest: true
    })
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
          attributes: ['id', 'name', 'image_path', 'is_display'],
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
    let categoryId = await adminService.checkCategory(category)

    const transaction = await sequelize.transaction()

    try {
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
      }, { transaction })

      // create product images
      const productId = newProduct.id
      const newImages = await Promise.all(
        productImages.map(async (image) => {
          return ProductImage.create({
            productId,
            name: image.name,
            imagePath: image.link,
            isDisplay: true
          }, { transaction })
        })
      )

      await transaction.commit()

      if (newProduct && newImages) {
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
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },

  putProduct: async (id, productInfo, productImages) => {
    const { name, description, category, cover, sku, quantity, priceRegular, priceSale } = productInfo

    // check category
    let categoryId = await adminService.checkCategory(category)

    try {
      // start a transaction
      const transaction = await sequelize.transaction()

      // update product
      const numUpdatedProducts = await Product.update(
        {
          name,
          categoryId,
          cover,
          description,
          sku,
          stockQuantity: quantity,
          priceRegular,
          priceSale
        },
        { where: { id }, transaction }
      )

      // delete old product images
      const numDestroyedImages = await ProductImage.destroy({ where: { product_id: id }, transaction })

      // create new product images
      await Promise.all(
        productImages.map(async (image) => {
          return ProductImage.create(
            {
              productId: id,
              name: image.name,
              imagePath: image.link,
            },
            { transaction }
          )
        })
      )

      // commit the transaction
      await transaction.commit()

      // return data
      if (numUpdatedProducts > 0 && numDestroyedImages > 0) {
        return {
          status: 'success',
          message: 'update product succeed'
        }
      } else {
        return {
          status: 'error',
          message: 'update product fail'
        }
      }
    } catch (error) {
      // rollback the transaction
      await transaction.rollback()

      throw error
    }
  },

  deleteProduct: async (id) => {
    const product = await Product.findOne({ where: { id } })
    if (!product) throw new Error('no product found')

    try {
      // start a transaction
      const transaction = await sequelize.transaction()

      const numDestroyedImages = await ProductImage.destroy({ where: { product_id: id }, transaction })
      const numDestroyedProduct = await Product.destroy({ where: { id }, transaction })

      // commit the transaction
      await transaction.commit()

      // return data
      if (numDestroyedProduct > 0 && numDestroyedImages > 0) {
        return {
          status: 'success',
          message: 'delete product succeed'
        }
      } else {
        return {
          status: 'error',
          message: 'delete product fail'
        }
      }
    } catch (error) {
      // rollback the transaction
      await transaction.rollback()

      throw error
    }
  },

  checkCategory: async (category) => {
    const categoryData = await Category.findOne({
      where: { name: category }
    })

    if (!categoryData) {
      throw new CError(`cannot find category ${category}`, 400)
    }

    return categoryData.id
  },

  getProducts: async (category, page, sort, keyword) => {
    // define display products per page
    const perPage = 12
    // define sorting options
    const sortOptions = {
      price_desc: ['price_regular', 'DESC'],
      price_asc: ['price_regular', 'ASC'],
      date_desc: ['createdAt', 'DESC'],
      date_asc: ['createdAt', 'ASC']
    }
    // get product count
    const productCount = await productService.getProductCount(category, keyword)

    const queryOptions = {
      where: {},
      order: [],
      limit: perPage,
      offset: (page - 1) * perPage,
      attributes: [
        'id',
        'name',
        'category_id',
        'cover',
        'description',
        'price_regular',
        'stock_quantity',
        [
          sequelize.cast(sequelize.literal('(SELECT SUM(quantity) FROM `OrderItems` WHERE `OrderItems`.`product_id` = `Product`.`id`)'), 'SIGNED'),
          'salesCount'
        ]
      ],
      include: [
        {
          model: Category,
          attributes: ['name']
        }
      ],
      raw: true,
      nest: true
    }
    if (category) {
      queryOptions.where.category_id = category
    }
    if (sort && sortOptions[sort]) {
      queryOptions.order.push(sortOptions[sort])
    }
    if (keyword) {
      queryOptions.where[Op.or] = [
        {
          name: {
            [Op.like]: `%${keyword}%`
          }
        }
      ]
    }

    const products = await Product.findAll(queryOptions)
    if (products.length) {
      return {
        status: 'success',
        message: 'products retrieved succeed',
        productCount,
        products
      }
    } else {
      return {
        status: 'success',
        message: 'no products found'
      }
    }
  },

  getOrder: async (id) => {
    const order = await Order.findByPk(id, {
      attributes: [
        'id',
        [sequelize.literal('DATE(order_date)'), 'order_date'],
        [sequelize.fn('CONCAT', sequelize.col('first_name'), ' ', sequelize.col('last_name')), 'customer_name'],
        'email',
        'phone',
        'shipping_method',
        'payment_method',
        'status',
        'address',
        'note',
        'total_price',
      ],
      include: {
        model: OrderItem,
        attributes: ['quantity', 'price_each'],
        include: {
          model: Product,
          attributes: ['name', 'cover']
        }
      }
    })

    const shipping_fee = calShippingFee(order.dataValues.shipping_method)
    order.setDataValue('shipping_fee', shipping_fee)

    if (order !== null) {
      return {
        status: 'success',
        message: 'order retrieved succeed',
        order
      }
    } else {
      return {
        status: 'success',
        message: 'no order found'
      }
    }
  },

  putOrder: async (id, orderStatus, note) => {
    try {
      const order = await Order.findByPk(id)
      if (!order) throw new Error('order not exists')

      // put order
      await Order.update(
        {
          status: orderStatus,
          note
        },
        { where: { id } }
      )
      return {
        status: 'success',
        message: 'put order succeed',
      }
    } catch (error) {
      return {
        status: 'error',
        message: error.message
      }
    }
  },

  getOrders: async (page, perPage, orderStatus, startDate, endDate) => {
    const queryOptions = {
      where: {
        order_date: {
          [Op.between]: [startDate, endDate]
        }
      },
      order: [],
      limit: perPage,
      offset: (page - 1) * perPage,
      attributes: [
        'id',
        [sequelize.literal('DATE(order_date)'), 'order_date'],
        'payment_method',
        [sequelize.fn('CONCAT', sequelize.col('first_name'), ' ', sequelize.col('last_name')), 'customer_name'],
        'status',
        'total_price'
      ],
      raw: true,
      nest: true
    }
    if (orderStatus) {
      queryOptions.where.status = orderStatus
    }

    const orders = await Order.findAll(queryOptions)

    // get order count
    const orderCount = await adminService.getOrderCount()

    // formate data
    orders.forEach(order => {
      order.order_date = dateFormateMonth(order.order_date)
    })

    if (orders.length) {
      return {
        status: 'success',
        message: 'orders retrieved succeed',
        orderCount,
        orders
      }
    } else {
      return {
        status: 'success',
        message: 'no orders found'
      }
    }
  },

  getOrderCount: async () => {
    let totalCount
    totalCount = await Order.count()

    return totalCount
  },

  getSales: async (startDate, endDate) => {
    const totals = await adminService.getSalesAmount(startDate, endDate)
    const YOY = await adminService.getYoYSales(startDate, endDate, totals)
    const compareTo = getPreviousYear(startDate)
    const data = Object.keys(totals).map((key) => ({
      [key]: {
        sales: totals[key],
        compareTo: compareTo,
        YOY: YOY[key],
      }
    }))

    if (data) {
      return {
        status: 'success',
        message: 'sales data retrieved successfully',
        data
      }
    } else {
      return {
        status: 'success',
        message: 'no data found'
      }
    }
  },

  getSalesAmount: async (startDate, endDate) => {

    const queryOptions = {
      where: {
        [Op.or]: [
          { status: 'cancel' },
          { status: 'pending' },
          { status: 'delivered' }
        ]
      },
      attributes: [
        'status',
        [sequelize.fn('SUM', sequelize.col('total_price')), 'total_price'],
      ],
      group: ['status'],
      raw: true
    }

    if (startDate !== undefined && endDate !== undefined) {
      queryOptions.where.created_at = {
        [Op.between]: [startDate, endDate]
      }
    }

    const order = await Order.findAll(queryOptions)

    const totals = {
      total: 0,
      active: 0,
      shipped: 0
    }
    order.forEach(row => {
      const status = row.status
      const total_price = parseFloat(row.total_price)

      totals.total += total_price

      if (status === 'pending' || status === 'delivered') {
        totals.active += total_price
      }

      if (status === 'delivered') {
        totals.shipped += total_price
      }
    })

    if (totals) return totals
  },

  getYoYSales: async (startDate, endDate, salesThisYear) => {
    startDate = convertToOneYearAgo(startDate)
    endDate = convertToOneYearAgo(endDate)

    const salesLastYear = await adminService.getSalesAmount(startDate, endDate)

    // YOY percent
    const YOY = {}

    for (const key in salesLastYear) {
      if (salesLastYear.hasOwnProperty(key)) {
        const lastYear = salesLastYear[key]
        const thisYear = salesThisYear[key]

        const percentageChange = (percentChange(lastYear, thisYear) * 100).toFixed(2) + "%"
        YOY[key] = percentageChange
      }
    }

    if (YOY) return YOY
  }
}

module.exports = adminService