// cart routes
const express = require('express')
const router = express.Router()

// import auth
const { authenticated } = require('../../middleware/api-auth')

// import controller
const cartController = require('../../controllers/cartController')

router.post('/', authenticated, cartController.postCartItem)
router.get('/', authenticated, cartController.getCart)

module.exports = router
