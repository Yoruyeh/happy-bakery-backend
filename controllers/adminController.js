const adminService = require('../services/adminService')
const { CError } = require('../middleware/error-handler')
const { isValidateId } = require('../helpers/validationHelper')

const adminController = {

  signIn: async (req, res, next) => {
    try {
      const { email, password } = req.body
      const { status, message, token, user } = await adminService.signIn(email, password)
      return res.json({
        status,
        message,
        token,
        user,
      })
    } catch (error) {
      next(error)
    }
  },

  getProduct: async (req, res, next) => {
    try {
      const { id } = req.params
      if (!isValidateId(id)) throw new CError('product id invalid', 400)
      const { status, message, product } = await adminService.getProduct(id)
      return res.json({
        status,
        message,
        product
      })
    } catch (error) {
      next(error)
    }
  },

  getAdminSetting: async (req, res, next) => {
    try {
      if (!req.user) throw new CError('Admin data not found', 400)
      if (!req.isAuthenticated()) throw new CError('Admin not authenticated', 401)

      const currentAdminId = req.user.id
      console.log(currentAdminId)
    } catch (error) {
      next(error)
    }
  }
}
module.exports = adminController