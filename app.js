// require models
const express = require('express')
const mongoose = require('mongoose')
const methodOverride = require('method-override')

// 在非正式環境時使用 dotenv
if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// use modules
const app = express()
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

// port
const PORT = 3000

// require data
const Restaurant = require('./models/restaurant')

// require express-handlebars
const exphbs = require('express-handlebars')

// 資料庫連線狀態
const db = mongoose.connection
db.on('error', () => {
  console.log('MongoDB error.')
})
db.once('open', () => {
  console.log('MondoDB connected.')
})

// set engine
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

// use modules
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

// render index page
app.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .sort({ rating: 'desc'})
    .then(restaurant => res.render('index', { restaurant }))
    .catch(err => console.log(err))
})
// search function
app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  const restaurant = []

  return Restaurant.find()
    .lean()
    .then(restaurants => {
      restaurants.filter(data => {
        if (data.name.toLowerCase().includes(keyword.trim().toLowerCase())) {
          restaurant.push(data)
        }
      })
      res.render('index', { restaurant, keyword })
    })
    .catch(error => console.log(error))
})

// render new page
app.get('/restaurants/new', (req, res) => {
  return res.render('new')
})
// post new restaurant
app.post('/restaurants', (req, res) => {
  const {name, name_en, category, image, location, phone, google_map, rating, description} = req.body
  return Restaurant.create({ name, name_en, category, image, location, phone, google_map, rating, description })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// render detail page
app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('detail', { restaurant }))
    .catch(error => console.log(error))
})

// render edit page
app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})
// post edited info
app.put('/restaurants/:id', (req, res) => {
  const id = req.params.id
  const { name, name_en, category, image, location, phone, google_map, rating, description } = req.body
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
app.delete('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// listen to the server
app.listen(PORT, () => {
  console.log(`This app is listening to http://localhost:${PORT}`)
})