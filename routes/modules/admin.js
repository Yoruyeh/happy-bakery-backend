// user routes
const express = require('express')
const router = express.Router()
const { multiUpload } = require('../../middleware/multer')

// import auth
const { authenticatedAdmin } = require('../../middleware/api-auth')

// import controller
const adminController = require('../../controllers/adminController')

// admin login
router.post('/signin', adminController.signIn)

// product
router.get('/product/:id', authenticatedAdmin, adminController.getProduct)

// product image
router.post('/product/image', authenticatedAdmin, multiUpload, adminController.postProductImage)

// admin info
router.put('/password', authenticatedAdmin, adminController.putPassword)

module.exports = router
