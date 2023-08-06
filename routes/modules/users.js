// user routes
const express = require('express')
const router = express.Router()

// import controller
const userController = require('../../controllers/userController')

// user login
router.post('/signin', userController.signIn)
router.post('/', userController.signUp)

module.exports = router
