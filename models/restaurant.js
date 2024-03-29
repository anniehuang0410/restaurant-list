const mongoose = require('mongoose')

// define Schema(資料庫模組)
const Schema = mongoose.Schema
const restaurantSchema = new Schema ({
  name: {
    type: String,
    //required: true
  },
  name_en: {
    type: String
  },
  category: {
    type: String,
    //required: true
  },
  image: {
    type: String,
    //required: true
  },
  location: {
    type: String,
    //required: true
  },
  phone: {
    type: String,
    //required: true
  },
  google_map: {
    type: String
  },
  rating: {
    type: Number,
    //required: true
  },
  description: {
    type: String
  },
  // connection with user data
  userId: {  
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    required: true
  }
})

module.exports = mongoose.model('Restaurant', restaurantSchema)