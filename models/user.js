const mongoose = require('mongoose')

// define user Schema
const Schema = mongoose.Schema
const userSchema = new Schema ({
  name: {
    type: String
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  // create time(when the user info is created in the database)
  createAt: {
    type: Date, 
    default: Date.now
  }
})

// export the schema
module.exports = mongoose.model('User', userSchema)