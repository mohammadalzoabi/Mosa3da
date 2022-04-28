const express = require('express')
const router = express.Router()
const isLoggedIn = require('../config/auth2');
const isNotLoggedIn = require('../config/isNotLoggedIn')

const authController = require('../controllers/auth');
const cvUpload = require('../middleware/cvUpload')
const upload = require('../middleware/imageUpload')


//Login
router.get('/login', isLoggedIn, authController.getLogin)
router.post('/login', authController.postLogin)



//Signup
router.get('/signup' , isLoggedIn, authController.getSignup)
router.post('/signup', authController.postSignup)



//Therapist Join Us Form
router.get('/join-us', isLoggedIn, authController.getJoinUs)
router.post('/join-us', cvUpload.single("cv"), isLoggedIn, authController.postJoinUs)



//Logout
router.get('/logout' , authController.getLogout)



//User Account
router.get('/edit-account', isNotLoggedIn, authController.getEditAccount)
router.post('/edit-account', upload.single('image'), isNotLoggedIn, authController.postEditAccount)




module.exports = router