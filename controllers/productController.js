const productService = require('../services/productService')
const { CError } = require('../middleware/error-handler')
const { isValidateId } = require('../helpers/validation-helper')

const productController = {

  getProducts: async (req, res, next) => {
    try {
      let { category, page, sort } = req.query
      // page should be at least 1
      page = page >= 1 ? page : 1

      const { status, message, productCount, products } = await productService.getProducts(category, page, sort)
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

  getPopularProduct: async (req, res, next) => {
    try {
      const { top } = req.query
      if (top !== undefined && !isValidateId(top)) throw new CError('invalid product id', 400)
      const topCount = top || 5

      const { status, message, product } = await productService.getPopularProducts(topCount)
      res.json({ status, message, product })
    } catch (error) {
      next(error)
    }
  }
}
module.exports = productController