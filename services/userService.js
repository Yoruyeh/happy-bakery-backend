const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { User } = require('../models')

const userService = {
  signIn: async (email, password) => {
    const user = await User.findOne({ where: { email } })
    if (!user) {
      const error = new Error('User not found')
      error.status = 404
      throw error
    }
    if (!bcrypt.compareSync(password, user.password)) {
      const error = new Error('Wrong password')
      error.status = 403
      throw error
    }
    if (user.is_admin) {
      const error = new Error('Access forbidden')
      error.status = 403
      throw error
    }
    const payload = { id: user.id }
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' })
    return {
      status: 'success',
      message: 'login succeed',
      token,
      user: {
        id: user.id,
        email: user.email,
        is_admin: user.is_admin
      }
    }
  }
}

module.exports = userService