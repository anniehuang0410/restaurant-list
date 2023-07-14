// require express
const express = require('express')
const mongoose = require('mongoose')

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
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// use static files
app.use(express.static('public'))

// set server
app.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurant => res.render('index', { restaurant }))
    .catch(err => console.log(err))
})

// show details
/*app.get('/restaurants/:restaurant_id', (req, res) => {
  const restaurant = restaurantList.results.find(res => 
    res.id.toString() === req.params.restaurant_id
  )
  res.render('show', { restaurant })
})

// search function
app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  const filteredRestaurants = restaurantList.results.filter(restaurant => 
    restaurant.name.toLowerCase().includes(keyword.toLowerCase())
  )
  res.render('index', { restaurant : filteredRestaurants, keyword })
})*/

// listen to the server
app.listen(PORT, () => {
  console.log(`This app is listening to http://localhost:${PORT}`)
})