const express = require('express')
const router = express.Router()
// import restaurant
const Restaurant = require('../../models/restaurant')

// render index page
router.get('/', (req, res) => {
  const userId = req.user._id
  Restaurant.find({ userId })
    .lean()
    .then(restaurant => res.render('index', { restaurant }))
    .catch(err => console.log(err))
})

// search and sort function
router.get('/search', (req, res) => {
  const userId = req.user._id
  const sort = req.query.sort
  const keyword = req.query.keyword
  const restaurant = []

  return Restaurant.find({ userId })
    .lean()
    .sort(`${sort}`)
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

module.exports = router