const express = require('express')
const router = express.Router()

// render user login page
router.get('/login', (req, res) => {
  res.render('login')
})

// submit login info
router.post('/login', (req, res) => {

})

// render user register page
router.get('/register', (req, res) => {
  res.render('register')
})

// submit register info

module.exports = router