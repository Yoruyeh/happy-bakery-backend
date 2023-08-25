// product routes
const express = require('express')
const router = express.Router()

// import auth
const { authenticated } = require('../../middleware/api-auth')

// import controller
const productController = require('../../controllers/productController')

// product view
router.get('/popular', productController.getPopularProducts)
router.get('/search', productController.searchProducts)
router.get('/:id', productController.getProduct)
router.get('/', productController.getProducts)

module.exports = router
