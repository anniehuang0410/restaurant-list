// Require express and express handlebars
const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const Restaurant = require('./models/restaurant.js')

// only use in unproductive environment
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
// connect to database
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

// check database connection
const db = mongoose.connection
db.on('error', () => {
  console.log('MongoDB error!')
})
db.once('open', () => {
  console.log('MongoDB connected!')
})

// set template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// setting body-parser
app.use(bodyParser.urlencoded({ extended: true }))

// setting static files
app.use(express.static('public'))

// set routing on index page
app.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurant => res.render('index', { restaurant }))
    .catch(error => console.log(error))
})

// set routing for new page
app.get('/restaurants/new', (req, res) => {
  return res.render('new')
})
// add new item to restaurant list
app.post('/restaurants', (req, res) => {
  const name = req.body.name
  Restaurant.create({name})
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// show detail
app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.log(error))
})

/*app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  const restaurants = restaurantList.results.filter(restaurant => restaurant.name.toLowerCase().includes(req.query.keyword.toLowerCase()) || restaurant.category.toLowerCase().includes(req.query.keyword.toLowerCase()))
  res.render('index', { restaurant: restaurants, keyword: keyword })
})*/

// listen and start the server
app.listen(3000, () => {
  console.log(`This server is listening to http://localhost:3000`)
})