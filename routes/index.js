const express = require('express')
const router = express.Router()
const isAuth = require('../config/auth');
const isAuth3 = require('../config/auth3');

const siteController = require('../controllers/home');


// Home Page
router.get('/', isAuth3, siteController.getIndex)

// Dashboard Page for Logged In Users
router.get('/dashboard', isAuth, siteController.getDashboard)




// Therapists List and Singular Therapist
router.get('/therapists', siteController.getTherapists)
router.get('/therapists/:therapistId', siteController.getTherapist)



// User Account
router.get('/account', isAuth, siteController.getAccount)



module.exports = router