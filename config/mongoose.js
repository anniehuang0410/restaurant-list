const mongoose = require('mongoose')

// 在非正式環境時使用 dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// use modules
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

// 資料庫連線狀態
const db = mongoose.connection
db.on('error', () => {
  console.log('MongoDB error.')
})
db.once('open', () => {
  console.log('MondoDB connected.')
})

module.exports = db