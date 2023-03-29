const mongoose = require('mongoose')
const restaurantList = require('../../restaurant.json')
const Restaurant = require('../restaurant')

const eachRestaurant = restaurantList.results

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection
db.on('error', () => {
  console.log('MongoDB error!')
})
db.once('open', () => {
  console.log('MongoDB connected!')
  console.log(eachRestaurant[0].name)
  for (let i = 0; i < eachRestaurant.length; i++) {
    Restaurant.create({ 
      name: eachRestaurant[i].name,
      name_en: eachRestaurant[i].name_en, 
      category: eachRestaurant[i].category,
      image: eachRestaurant[i].image,
      location: eachRestaurant[i].location,
      phone: eachRestaurant[i].phone,
      google_map: eachRestaurant[i].google_map,
      rating: eachRestaurant[i].rating,
      description: eachRestaurant[i].description
    })
  }
})