const passport = require('passport')
const LocalStrategy = require('./strategies/local')
const JtwStrategy = require('./strategies/jwt')
const FacebookStrategy = require('./strategies/facebook')

// strategy
LocalStrategy(passport)
JtwStrategy(passport)
FacebookStrategy(passport)

module.exports = passport