const productService = require('../services/productService')

const productController = {

  getProducts: async (req, res, next) => {
    try {
      let { category, page, sort } = req.query
      // page should be at least 1
      page = page >= 1 ? page : 1

      const { status, message, products } = await productService.getProducts(category, page, sort)
      res.json({ status, message, products })
    } catch (error) {
      next(error)
    }
  }
}
module.exports = productController