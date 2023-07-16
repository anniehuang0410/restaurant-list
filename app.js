// require models
const express = require('express')
const session = require('express-session')
const methodOverride = require('method-override')
// flash message
const flash = require('connect-flash')

const routes = require('./routes')

const usePassport = require('./config/passport')

require('./config/mongoose')

// use modules
const app = express()

// port
const PORT = 3000

// require data
const Restaurant = require('./models/restaurant')

// require express-handlebars
const exphbs = require('express-handlebars')

// set engine
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

// use cookie-session
app.use(session({
  secret: 'ThisIsMySecret',
  resave: false,
  saveUninitialized: true
}))

// use modules
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

usePassport(app)

app.use(flash())

// set middleware
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  // set msg info
  res.locals.success_msg = req.flash('success_msg') 
  res.locals.warning_msg = req.flash('warning_msg')
  next()
})

app.use(routes)


// listen to the server
app.listen(PORT, () => {
  console.log(`This app is listening to http://localhost:${PORT}`)
})