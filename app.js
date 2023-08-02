if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const routes = require('./routes')
const passport = require('./config/passport')
const methodOverride = require('method-override')

const app = express()
const port = process.env.PORT || 3000
const http = require('http')
const server = http.createServer(app)

// middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(passport.initialize())
app.use(methodOverride('_method'))

// routes
app.get('', (req, res) => {
  res.send('Hello world!')
})
app.get('/favicon.ico', (req, res) => {
  res.sendStatus(204)
})
app.use(routes)

// start
server.listen(port, () => console.log(`Example app listening on port localhost:${port}`))

module.exports = app
