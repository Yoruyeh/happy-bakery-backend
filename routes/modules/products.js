// user routes
const express = require('express')
const router = express.Router()

// import auth
const { authenticated } = require('../../middleware/api-auth')

// import controller
const productController = require('../../controllers/productController')

// user login
router.get('/', productController.getProducts)

module.exports = router
