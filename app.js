// require models
const express = require('express')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const routes = require('./routes')

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
app.use(routes)


// listen to the server
app.listen(PORT, () => {
  console.log(`This app is listening to http://localhost:${PORT}`)
})