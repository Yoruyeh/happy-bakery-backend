const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const validator = require('validator')
const PhoneNumber = require('libphonenumber-js')
const { dateFormate } = require('../helpers/dateHelper')
const sequelize = require('sequelize')
const { CError } = require('../middleware/error-handler')
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
  },

  getSetting: (id) => {
    return User.findByPk(id, {
      attributes: [
        'firstName',
        'lastName',
        'gender',
        'email',
        'address',
        'phone',
        [sequelize.literal('DATE(birthday)'), 'birthday']
      ],
      raw: true,
      nest: true
    })
  },

  putSetting: async (id, data) => {
    const { firstName, lastName, gender, birthday, email, address, phone } = data

    // error handling
    const errors = []

    if (!email || !validator.isEmail(email)) {
      errors.push('Invalid email')
    }

    if (birthday !== undefined && isNaN(new Date(birthday).getTime())) {
      errors.push('Invalid birthday')
    }

    if (phone !== undefined && !new PhoneNumber(phone).isValid()) {
      errors.push('Invalid phone number')
    }

    if ((firstName !== undefined && firstName.length > 50) ||
      (lastName !== undefined && lastName.length > 50) ||
      (address !== undefined && address.length > 100)) {
      errors.push('Exceeded word limit')
    }

    if (!['male', 'female', 'other', '', undefined].includes(gender)) {
      errors.push('Invalid gender input')
    }

    if (errors.length > 0) {
      throw new CError(errors.join(', '), 400)
    }

    // update user
    const user = await User.findByPk(id)
    if (!user) {
      throw new Error('User not exists')
    } else {
      return user.update({
        firstName,
        lastName,
        gender,
        birthday,
        email,
        address,
        phone
      })
        .then((updatedUser) => {
          const userData = updatedUser.dataValues
          userData.birthday = dateFormate(userData.birthday)
          delete userData.password
          delete userData.isAdmin
          delete userData.createdAt
          delete userData.updatedAt
          return {
            status: 'success',
            message: 'User update succeed',
            user: userData
          }
        })
    }
  }
}

module.exports = userService