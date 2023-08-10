// orders routes
const express = require('express')
const router = express.Router()

// import auth
const { authenticated } = require('../../middleware/api-auth')

// import controller
const orderController = require('../../controllers/orderController')

router.get('/:id', authenticated, orderController.getOrder)
router.post('/', authenticated, orderController.postOrder)

module.exports = router
