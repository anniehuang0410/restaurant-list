// require express
const express = require('express')
const app = express()
const port = 3000

// require data
const restaurantList = require('./restaurant.json')

// require express-handlebars
const exphbs = require('express-handlebars')
// set engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// use static files
app.use(express.static('public'))

// set server
app.get('/', (req, res) => {
  const restaurant = restaurantList.results
  res.render('index', { restaurant })
})

// show details
app.get('/restaurants/:restaurant_id', (req, res) => {
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
})

// listen to the server
app.listen(port, () => {
  console.log(`This app is listening to http://localhost:${port}`)
})