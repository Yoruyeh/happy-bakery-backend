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
    const payload = { id: user.id }
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' })
    return {
      status: 'success',
      message: 'login succeed',
      token,
      user: {
        id: user.id,
        email: user.email,
        admin: user.isAdmin
      }
    }
  },

  signUp: async (firstName, lastName, gender, email, password) => {
    const user = await User.findOne({ where: { email } })
    if (user) {
      throw new Error('email already exists')
    } else {
      const hash = await bcrypt.hash(password, 10)
      const newUser = await User.create({
        firstName,
        lastName,
        gender,
        email,
        password: hash,
        is_admin: false,
      })

      const token = jwt.sign({ id: newUser.dataValues.id }, process.env.JWT_SECRET, { expiresIn: '30d' })

      return {
        status: 'success',
        message: 'register succeed',
        token,
        user: {
          id: newUser.dataValues.id,
          email: newUser.email,
        },
      }
    }
  }
}

module.exports = userService