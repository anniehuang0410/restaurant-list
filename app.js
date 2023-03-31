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
  const source = req.body
  const name = source.name
  const name_en = source.name_en
  const category = source.category
  const image = source.image
  const location = source.location
  const phone = source.phone
  const google_map = source.google_map
  const rating = source.rating
  const description = source.description
  Restaurant.create({name, name_en, category, image, location, phone, google_map, rating, description})
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

// allow editing details
app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})
// save edited info
app.post('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  const source = req.body
  const name = source.name
  const name_en = source.name_en
  const category = source.category
  const image = source.image
  const location = source.location
  const phone = source.phone
  const google_map = source.google_map
  const rating = source.rating
  const description = source.description
  return Restaurant.findById(id)
    .then(restaurant => { 
        restaurant.name = name 
        restaurant.name_en = name_en
        restaurant.category = category
        restaurant.image = image
        restaurant.location = location
        restaurant.phone = phone
        restaurant.google_map = google_map
        restaurant.rating = rating
        restaurant.description = description
        restaurant.save()
      })
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch(error => console.log(error))
})

// delete function
app.post('/restaurants/:id/delete', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
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