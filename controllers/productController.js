const productService = require('../services/productService')
const { CError } = require('../middleware/error-handler')
const { isValidateId, isValidDate } = require('../helpers/validation-helper')
const { getOneYearAgo, getToday } = require('../helpers/date-helper')

const productController = {

  getProducts: async (req, res, next) => {
    try {
      let { category, page, sort, keyword } = req.query
      // page should be at least 1
      page = page >= 1 ? page : 1
      if (keyword && (typeof keyword !== "string" || keyword.length < 2)) {
        throw new Error("Invalid search keyword")
      }

      const { status, message, productCount, products } = await productService.getProducts(category, page, sort, keyword)
      res.json({ status, message, productCount, products })
    } catch (error) {
      next(error)
    }
  },

  getProduct: async (req, res, next) => {
    try {
      const { id } = req.params
      if (!id || !isValidateId(id)) throw new CError('invalid product id', 400)

      const { status, message, product } = await productService.getProduct(id)
      res.json({ status, message, product })
    } catch (error) {
      next(error)
    }
  },

  searchProducts: async (req, res, next) => {
    try {
      const { keyword } = req.query
      if (!keyword || typeof keyword !== "string" || keyword.length < 2) {
        throw new Error("Invalid search keyword")
      }

      const { status, message, products } = await productService.searchProducts(keyword)
      res.json({ status, message, products })
    } catch (error) {
      next(error)
    }
  },

  getPopularProducts: async (req, res, next) => {
    try {
      let { top, startDate, endDate, sort } = req.query
      top = top >= 3 ? parseInt(top, 10) : 5

      // set default date
      if (!isValidDate(startDate)) {
        startDate = getOneYearAgo()
      }
      if (!isValidDate(endDate)) {
        endDate = getToday()
      }
      if (sort !== 'salesAmount' && sort !== 'salesQuantity' && sort !== '' && sort !== undefined) {
        throw new CError('sort invalid', 400)
      }

      const { status, message, products } = await productService.getPopularProducts(top, startDate, endDate, sort)
      res.json({ status, message, products })
    } catch (error) {
      next(error)
    }
  }
}
module.exports = productController