// Require express and express handlebars
const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')

const restaurantList = require('./restaurant.json')

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

// set routing
app.get('/', (req, res) => {
  res.render('index', { restaurant: restaurantList.results })
})

app.get('/restaurants/:restaurant_id', (req, res) => {
  const restaurant = restaurantList.results.find(restaurant => restaurant.id.toString() === req.params.restaurant_id)
  res.render('show', { restaurant: restaurant })
})

app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  const restaurants = restaurantList.results.filter(restaurant => restaurant.name.toLowerCase().includes(req.query.keyword.toLowerCase()) || restaurant.category.toLowerCase().includes(req.query.keyword.toLowerCase()))
  res.render('index', { restaurant: restaurants, keyword: keyword })
})

// set template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// setting static files
app.use(express.static('public'))

// listen and start the server
app.listen(3000, () => {
  console.log(`This server is listening to http://localhost:3000`)
})