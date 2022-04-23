const express = require('express')
const router = express.Router()
const isLoggedIn = require('../config/auth2');
const isNotLoggedIn = require('../config/auth')

const adminController = require('../controllers/admin');




// Review Applications
router.get('/applications', isNotLoggedIn, adminController.getApplications)

// Accept and Decline Application
router.post('/accept-application', isNotLoggedIn, adminController.postAcceptApplication)
router.post('/decline-application', isNotLoggedIn, adminController.postDeclineApplication)


module.exports = router