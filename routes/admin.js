const express = require('express')
const router = express.Router()
const isLoggedIn = require('../config/auth2');
const isNotLoggedIn = require('../config/auth')
const isNotAdmin = require('../config/isAdmin')

const adminController = require('../controllers/admin');




// Review Applications
router.get('/applications', isNotLoggedIn, isNotAdmin, adminController.getApplications)

// Accept and Decline Application
router.post('/accept-application', isNotLoggedIn, isNotAdmin, adminController.postAcceptApplication)
router.post('/decline-application', isNotLoggedIn, isNotAdmin, adminController.postDeclineApplication)


module.exports = router