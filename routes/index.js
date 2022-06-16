const express = require('express')
const router = express.Router()
const isNotLoggedIn = require('../config/isNotLoggedIn');
const ifLoggedInDahsboard = require('../config/ifLoggedInDahsboard');

const siteController = require('../controllers/home');


// Home Page
router.get('/', ifLoggedInDahsboard, siteController.getIndex)

// Dashboard Page for Logged In Users
router.get('/dashboard', isNotLoggedIn, siteController.getDashboard)

// Therapists List and Singular Therapist
router.get('/therapists', siteController.getTherapists)
router.get('/therapists/:therapistId', siteController.getTherapist)

// Patients List and Singular User
router.get('/patients', isNotLoggedIn, siteController.getPatients)
router.get('/users/:userId', isNotLoggedIn, siteController.getUser)

// Messages and Chat
router.get('/messages', isNotLoggedIn, siteController.getMessages)
router.get('/messages/:chatId', isNotLoggedIn, siteController.getChat)


// Video Call
router.get('/video/:roomId', isNotLoggedIn, siteController.getVideo)


// Greoup Therapy
router.get('/group-therapy', isNotLoggedIn, siteController.getGroupTherapy)
router.get('/group-video/:roomId', isNotLoggedIn, siteController.getGroupTherapyVideo)

// User Account
router.get('/account', isNotLoggedIn, siteController.getAccount)


module.exports = router