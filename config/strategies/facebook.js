// Facebook strategy
const { User } = require('../../models')
const FacebookStrategy = require('passport-facebook').Strategy
const bcrypt = require('bcryptjs')

module.exports = passport => {

  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['email', 'displayName']
  },
    (accessToken, refreshToken, profile, done) => {
      const { name, email } = profile._json
      User.findOne({ email })
        .then(user => {
          if (user) return done(null, user)

          // create random password for required schema for facebook login user
          const randomPassword = Math.random().toString(36).slice(-8)
          bcrypt
            .genSalt(10)
            .then(salt => bcrypt.hash(randomPassword, salt))
            .then(hash => User.create({
              firstName: name,
              email,
              password: hash
            })
              .then(user => done(null, user))
              .catch(err => done(err, false))
            )
        }
        )
    }
  ))
}
