const express = require('express')
const router = express.Router()

// import routes
const home = require('./modules/home')
const restaurant = require('./modules/restaurant')

router.use('/', home)
router.use('/', restaurant)

module.exports = router