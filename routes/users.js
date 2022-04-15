const express = require('express')
const router = express.Router()
const isAuth = require('../config/auth2');

const authController = require('../controllers/auth');


//Login
router.get('/login', isAuth, authController.getLogin)
router.post('/login', authController.postLogin)



//Signup
router.get('/signup' , isAuth, authController.getSignup)
router.post('/signup', authController.postSignup)


router.get('/logout' , authController.getLogout)

module.exports = router