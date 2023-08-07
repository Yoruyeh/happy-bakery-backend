// user routes
const express = require('express')
const router = express.Router()

// import auth
const { authenticated } = require('../../middleware/api-auth')

// import controller
const userController = require('../../controllers/userController')

// user login
router.post('/signin', userController.signIn)
router.post('/', userController.signUp)

// user info
router.get('/', authenticated, userController.getUserSetting)

module.exports = router
