const express = require('express')
const router = express.Router()
const isLoggedIn = require('../config/auth2');
const isNotLoggedIn = require('../config/auth')

const bookController = require('../controllers/booking');



router.post('/add-new-session', isNotLoggedIn, bookController.addSession)


router.post('/book', isNotLoggedIn, bookController.bookTherapist);









module.exports = router