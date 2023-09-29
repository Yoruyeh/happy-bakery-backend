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

// product image
router.post('/product/image', authenticatedAdmin, multiUpload, adminController.postProductImage)

// product
router.get('/product/:id', authenticatedAdmin, adminController.getProduct)
router.put('/product/:id', authenticatedAdmin, adminController.putProduct)
router.delete('/product/:id', authenticatedAdmin, adminController.deleteProduct)
router.get('/products', authenticatedAdmin, adminController.getProducts)
router.post('/product', authenticatedAdmin, adminController.postProduct)

// order
router.get('/order/:id', authenticatedAdmin, adminController.getOrder)
router.put('/order/:id', authenticatedAdmin, adminController.putOrder)
router.get('/orders', authenticatedAdmin, adminController.getOrders)

// sales
router.get('/sales/interval', authenticatedAdmin, adminController.getIntervalSales)
router.get('/sales/status', authenticatedAdmin, adminController.getStatusSales)

// admin info
router.put('/password', authenticatedAdmin, adminController.putPassword)
router.get('/', authenticatedAdmin, adminController.getAdminSetting)

module.exports = router
