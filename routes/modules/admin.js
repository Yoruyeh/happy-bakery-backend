// user routes
const express = require('express')
const router = express.Router()

// import auth
const { authenticatedAdmin } = require('../../middleware/api-auth')

// import controller
const adminController = require('../../controllers/adminController')

// admin login
router.post('/signin', adminController.signIn)

// admin info
router.get('/', authenticatedAdmin, adminController.getAdminSetting)

module.exports = router
