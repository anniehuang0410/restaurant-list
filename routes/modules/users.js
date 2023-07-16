const express = require('express')
const passport = require('passport')
const router = express.Router()

// require user Schema
const User = require('../../models/user')

// render user login page
router.get('/login', (req, res) => {
  res.render('login')
})

// submit login info
router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login'
}))

// render user register page
router.get('/register', (req, res) => {
  res.render('register')
})

// submit register info
router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  // check if this email is registered
  User.findOne({ email })
    .then(user => {
      // already registered
      if (user) {
        console.log('User already existed.')
        // still on register page and show the typed info 
        res.render('register', {
          name, email, password, confirmPassword
        })
      // not registered: add info into database 
      } else {
        return User
          .create({
            name, email, password
          })
          .then(() => res.redirect('/'))
          .catch(err => console.log(err))  
      }
    })
})

module.exports = router