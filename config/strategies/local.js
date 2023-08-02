// Local strategy
const LocalStrategy = require('passport-local')
const { User } = require('../../models')
const bcrypt = require('bcryptjs')

module.exports = passport => {
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, (email, password, done) => {
    // use email to check whether user exists
    // find user info return to req.user
    User.findOne({ where: { email } })
      .then(user => {
        if (!user) {
          const error = new Error('email does not exist!')
          error.status = 401
          return done(error, false)
        }
        // compare password
        bcrypt.compare(password, user.password).then(isMatch => {
          if (!isMatch) {
            const error = new Error('email or password incorrect.')
            error.status = 401
            return done(error, false)
          }
          // authenticated, return user
          return done(null, user.get())
        })
          .catch(err => done(err, false))
      })
  }))
}