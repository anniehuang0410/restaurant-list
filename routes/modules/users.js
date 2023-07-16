const express = require('express')
const passport = require('passport')
const bcrypt = require('bcryptjs')
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
  // set error message
  const errors = []
  // email and password are required
  if (!email || !password || !confirmPassword) {
    errors.push({ message: '除姓名外的欄位都是必填。' })
  }
  // password and confirmPassword need to be the same
  if (password !== confirmPassword) {
    errors.push({ message: '密碼與確認密碼不相符！' })
  }
  // if error
  if (errors.length) {
    return res.render('register', {
      errors,
      name,
      email,
      password,
      confirmPassword
    })
  }
  // check if this email is registered
  User.findOne({ email })
    .then(user => {
      // already registered
      if (user) {
        errors.push({ message: '這個 Email 已經註冊過了。' })
        // still on register page and show the typed info 
        res.render('register', {
          errors, name, email, password, confirmPassword
        })
      // not registered: add info into database 
      } 
      return bcrypt
        .genSalt(10)
        .then(salt => bcrypt.hash(password, salt))
        .then(hash => User
          .create({
            name, email, password: hash
          }))
        .then(() => res.redirect('/'))
        .catch(err => console.log(err))
      }
    )
})

// logout
router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', '你已經成功登出。')
  res.redirect('/users/login')
})

module.exports = router