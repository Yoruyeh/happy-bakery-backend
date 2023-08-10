const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')
const users = require('./modules/users')
const products = require('./modules/products')
const orders = require('./modules/orders')
const { apiErrorHandler } = require('../middleware/error-handler')

// route branch
router.use('/api/admin', admin)
router.use('/api/users', users)
router.use('/api/products', products)
router.use('/api/orders', orders)

router.get('/', (req, res) => {
  res.send('Hello world!')
})

// error handler
router.use('/', apiErrorHandler)

module.exports = router
