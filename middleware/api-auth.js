const passport = require('../config/passport')

module.exports = {
  // user auth
  authenticated: (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
      if (err || !user) {
        return res
          .status(401)
          .json({ status: 'error', message: 'unauthorized' })
      }
      req.user = user
      return next()
    })(req, res, next)
  },
  // admin auth
  authenticatedAdmin: (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
      if (err || !user) {
        return res
          .status(401)
          .json({ status: 'error', message: 'unauthorized' })
      }
      if (user.isAdmin == false) {
        return res
          .status(403)
          .json({ status: 'error', message: 'Permission denied, it is only for admin' })
      }
      req.user = user
      return next()
    })(req, res, next)
  }
}
