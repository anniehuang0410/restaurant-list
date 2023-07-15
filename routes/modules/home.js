const express = require('express')
const router = express.Router()
// import restaurant
const Restaurant = require('../../models/restaurant')

// render index page
router.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .sort({ rating: 'desc' })
    .then(restaurant => res.render('index', { restaurant }))
    .catch(err => console.log(err))
})
// search function
router.get('/search', (req, res) => {
  const keyword = req.query.keyword
  const restaurant = []

  return Restaurant.find()
    .lean()
    .sort({ rating: 'desc' })
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