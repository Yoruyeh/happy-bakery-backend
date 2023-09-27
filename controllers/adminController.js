const adminService = require('../services/adminService')
const { CError } = require('../middleware/error-handler')
const { isValidateId, isValidDate, validProduct, validateImages } = require('../helpers/validation-helper')
const { getOneWeekAgo, getToday } = require('../helpers/date-helper')
const { imgurFileHandler } = require('../helpers/file-helper')

const adminController = {

  signIn: async (req, res, next) => {
    try {
      const { email, password } = req.body
      const { status, message, token, user } = await adminService.signIn(email, password)
      return res.json({
        status,
        message,
        token,
        user,
      })
    } catch (error) {
      next(error)
    }
  },

  getAdminSetting: async (req, res, next) => {
    try {
      if (!req.user) throw new CError('Admin data not found', 400)
      if (!req.isAuthenticated()) throw new CError('Admin not authenticated', 401)
      if (req.user.isAdmin !== true) throw new CError('Admin only', 400)

      const currentAdminId = req.user.id
      const admin = await adminService.getAdminSetting(currentAdminId)
      return res.json({ admin })
    } catch (error) {
      next(error)
    }
  },

  putPassword: async (req, res, next) => {
    try {
      const currentAdminId = req.user.id
      const data = req.body
      const { status, message, admin } = await adminService.putPassword(currentAdminId, data)
      return res.json({
        status,
        message,
        admin
      })
    } catch (error) {
      next(error)
    }
  },

  getProducts: async (req, res, next) => {
    try {
      let { category, page, sort, keyword } = req.query
      // page should be at least 1
      page = page >= 1 ? page : 1
      if (keyword && (typeof keyword !== "string" || keyword.length < 2)) {
        throw new Error("Invalid search keyword")
      }

      const { status, message, productCount, products } = await adminService.getProducts(category, page, sort, keyword)
      res.json({ status, message, productCount, products })
    } catch (error) {
      next(error)
    }
  },

  getProduct: async (req, res, next) => {
    try {
      const { id } = req.params
      if (!isValidateId(id)) throw new CError('product id invalid', 400)
      const { status, message, product } = await adminService.getProduct(id)
      return res.json({
        status,
        message,
        product
      })
    } catch (error) {
      next(error)
    }
  },

  postProduct: async (req, res, next) => {
    try {
      const { productInfo, productImage } = req.body
      if (!productInfo || !productImage) throw new CError('invalid input', 400)
      if (!validProduct(productInfo)) throw new CError('invalid product info', 400)
      if (!validateImages(productImage)) throw new CError('invalid product image', 400)

      const { status, message, newProduct, newImages } = await adminService.postProduct(productInfo, productImage)
      return res.json({
        status,
        message,
        newProduct,
        newImages
      })
    } catch (error) {
      next(error)
    }
  },

  putProduct: async (req, res, next) => {
    try {
      const { id } = req.params
      if (!isValidateId(id)) throw new CError('product id invalid', 400)
      const { productInfo, productImage } = req.body
      if (!productInfo || !productImage) throw new CError('invalid input', 400)
      if (!validProduct(productInfo)) throw new CError('invalid product info', 400)
      if (!validateImages(productImage)) throw new CError('invalid product image', 400)

      const { status, message } = await adminService.putProduct(id, productInfo, productImage)
      return res.json({
        status,
        message
      })
    } catch (error) {
      next(error)
    }
  },

  deleteProduct: async (req, res, next) => {
    try {
      const { id } = req.params
      if (!isValidateId(id)) throw new CError('product id invalid', 400)

      const { status, message } = await adminService.deleteProduct(id)
      return res.json({
        status,
        message
      })
    } catch (error) {
      next(error)
    }
  },

  postProductImage: async (req, res, next) => {
    try {
      const { files } = req

      const image = files && JSON.stringify(files) !== '{}' ? await imgurFileHandler(files) : null

      res.status(200).json({
        status: 'success',
        message: 'successfully upload img',
        image
      })
    } catch (err) {
      next(err)
    }
  },

  getOrders: async (req, res, next) => {
    let { page, perPage, orderStatus, startDate, endDate } = req.query
    // set page, perPage default
    page = page >= 1 ? page : 1
    perPage = perPage >= 5 ? parseInt(perPage, 10) : 10
    if (orderStatus !== 'pending' && orderStatus !== 'canceled' && orderStatus !== 'delivered' && orderStatus !== '' && orderStatus !== undefined) {
      throw new CError('status invalid', 400)
    }
    // set default date
    if (!isValidDate(startDate)) {
      startDate = getOneWeekAgo(startDate)
    }
    if (!isValidDate(endDate)) {
      endDate = getToday(endDate)
    }

    try {
      const { status, message, orderCount, orders } = await adminService.getOrders(page, perPage, orderStatus, startDate, endDate)
      res.json({ status, message, orderCount, orders })
    } catch (error) {
      next(error)
    }
  },

  getOrder: async (req, res, next) => {
    try {
      const { id } = req.params
      if (!isValidateId(id)) throw new CError('product id invalid', 400)

      const { status, message, order } = await adminService.getOrder(id)
      res.json({ status, message, order })
    } catch (error) {
      next(error)
    }
  },

  putOrder: async (req, res, next) => {
    try {
      const { id } = req.params
      const { orderStatus, note } = req.body
      if (!isValidateId(id)) throw new CError('product id invalid', 400)
      if (!['pending', 'canceled', 'delivered'].includes(orderStatus)) throw new CError('status invalid', 400)

      const { status, message } = await adminService.putOrder(id, orderStatus, note)
      res.json({ status, message })
    } catch (error) {
      next(error)
    }
  },

  getSales: async (req, res, next) => {
    try {
      const { startDate, endDate } = req.query
      // set default date
      if (!isValidDate(startDate)) {
        startDate = getOneWeekAgo(startDate)
      }
      if (!isValidDate(endDate)) {
        endDate = getToday(endDate)
      }

      const { status, message, data } = await adminService.getSales(startDate, endDate)
      res.json({ status, message, data })
    } catch (error) {
      next(error)
    }
  }
}
module.exports = adminController