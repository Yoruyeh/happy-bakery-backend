const validator = require('validator')
const zxcvbn = require('zxcvbn') // test password strong or weak by score 0-4
const PhoneNumber = require('libphonenumber-js');
const userService = require('../services/userService')
const { User } = require('../models')
const { CError } = require('../middleware/error-handler')

const userController = {

  signIn: async (req, res, next) => {
    try {
      const { email, password } = req.body
      const { status, message, token, user } = await userService.signIn(email, password)
      return res.json({
        status,
        message,
        token,
        user
      })
    } catch (error) {
      next(error)
    }
  },

  signUp: async (req, res, next) => {
    try {
      const { firstName, lastName, gender, email, password, termsAgreement } = req.body
      // Error: required items
      if (!email || email.trim() === '') throw new CError('email is required', 400)
      if (!validator.isEmail(email)) throw new CError('email is invalidated', 400)
      if (!password || password.trim() === '') throw new CError('password is required', 400)
      // Error: limitation
      if (firstName.length > 50 || lastName.length > 50) throw new CError('exceed word limit', 400)
      if (!['male', 'female', 'other', ''].includes(gender)) throw new CError('gender input error', 400)
      // Error: agreement checkbox
      if (!termsAgreement) throw new CError('must agree to it', 400)

      const { status, message, token, user } = await userService.signUp(firstName, lastName, gender, email, password)
      return res.json({
        status,
        message,
        token,
        user
      })
    } catch (error) {
      next(error)
    }
  },

  getUserSetting: async (req, res, next) => {
    try {
      if (!req.user) throw new CError('User data not found', 400)
      if (!req.isAuthenticated()) throw new CError('User not authenticated', 401)
      if (req.user.isAdmin === true) throw new CError('Admin not allowed', 400)

      const currentUserId = req.user.id
      const user = await userService.getSetting(currentUserId)
      return res.json({ user })
    } catch (error) {
      next(error)
    }
  },

  putUserSetting: async (req, res, next) => {
    try {
      if (!req.user) throw new CError('User data not found', 400)
      if (!req.isAuthenticated()) throw new CError('User not authenticated', 401)
      if (req.user.isAdmin === true) throw new CError('Admin not allowed', 400)

      const currentUserId = req.user.id
      const data = req.body
      const { status, message, user } = await userService.putSetting(currentUserId, data)
      return res.json({
        status,
        message,
        user
      })
    } catch (error) {
      next(error)
    }
  },

  putUserPassword: async (req, res, next) => {
    try {
      const user = req.user
      const { currentPW, newPW, confirmPW } = req.body

      if (!user || !req.isAuthenticated() || user.isAdmin) {
        throw new CError('Unauthorized', 401)
      }

      if (currentPW === undefined || newPW === undefined || confirmPW === undefined) {
        throw new CError('All fields are required', 400)
      }

      if (newPW === currentPW) {
        throw new CError('New password cannot be the same as the current password', 400)
      }

      const { status, message } = await userService.putPassword(user.id, req.body)
      res.json({ status, message })
    } catch (error) {
      next(error)
    }
  }

}
module.exports = userController