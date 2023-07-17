const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
// require restaurant data
const Restaurant = require('../restaurant')
const restaurantList = require('../../restaurant.json')
const restaurant = restaurantList.results

// User seeds
const User = require('../user')
// 依題目規定：user1 -> 1-3 res list; user1 -> 4-6 res list 
const SEED_USER = [
  {
    name: 'User1',
    email: 'user1@example.com',
    password: '12345678',
    startIndex: 0,
    endIndex: 3
  }, 
  {
    name: 'User2',
    email: 'user2@example.com',
    password: '12345678',
    startIndex: 3,
    endIndex: 6
  }
]

const db = require('../../config/mongoose')

db.once('open', () => {
  Promise.all(
    SEED_USER.map(user => {
      return bcrypt
        .genSalt(10)
        .then(salt => bcrypt.hash(user.password, salt))
        .then(hash => User.create({
          name: user.name,
          email: user.email,
          password: hash,
        }))
      .then(seedUser => {
        const userId = seedUser._id
        const userRestaurants = restaurant.slice(user.startIndex, user.endIndex) 
        return Promise.all(userRestaurants.map(restaurant => 
          Restaurant.create({
            id: restaurant.id,
            name: restaurant.name,
            name_en: restaurant.name_en,
            category: restaurant.category,
            image: restaurant.image,
            location: restaurant.location,
            phone: restaurant.phone,
            google_map: restaurant.google_map,
            rating: restaurant.rating,
            description: restaurant.description,
            userId
          })
        ))
      })
      .then(() => {
        console.log('done!')
        process.exit()
      })
      .catch(err => console.log(err))
}))})