const express = require('express')
const router = express.Router()
const isNotLoggedIn = require('../config/isNotLoggedIn')

const bookController = require('../controllers/booking');


// Add New Available Session
router.post('/add-new-session', isNotLoggedIn, bookController.addSession)

// Book Session With Therapist
router.post('/book', isNotLoggedIn, bookController.bookTherapist);

// Payment
router.get('/payment/:sessionId', isNotLoggedIn, bookController.getPayment)

router.post('/delete-session/:sessionId', isNotLoggedIn, bookController.deleteSession)









module.exports = router