const express = require('express')
const router = express.Router()
const isLoggedIn = require('../config/auth2');
const isNotLoggedIn = require('../config/auth')

const bookController = require('../controllers/booking');


// Add New Available Session
router.post('/add-new-session', isNotLoggedIn, bookController.addSession)

// Book Session With Therapist
router.post('/book', isNotLoggedIn, bookController.bookTherapist);









module.exports = router