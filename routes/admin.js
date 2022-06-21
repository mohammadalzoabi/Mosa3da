const express = require('express')
const router = express.Router()
const isNotLoggedIn = require('../config/isNotLoggedIn')
const isNotAdmin = require('../config/isAdmin')

const adminController = require('../controllers/admin');




// Review Applications
router.get('/applications', isNotLoggedIn, isNotAdmin, adminController.getApplications)

// Get Therapist's CV
router.get('/application/:therapistId', isNotLoggedIn, isNotAdmin, adminController.getApplication)

// Accept and Decline Application
router.post('/accept-application', isNotLoggedIn, isNotAdmin, adminController.postAcceptApplication)
router.post('/decline-application', isNotLoggedIn, isNotAdmin, adminController.postDeclineApplication)


// Get Group Therapy Page
router.get('/add-group-therapy', isNotLoggedIn, isNotAdmin, adminController.getAddGroupTherapies)

// Create or Delete Group Therapy Rooms
router.post('/add-group-therapy', isNotLoggedIn, isNotAdmin, adminController.postAddGroupTherapy)
router.post('/delete-group-therapy', isNotLoggedIn, isNotAdmin, adminController.postDeleteGroupTherapies)


// Get Reports Page
router.get('/reports', isNotLoggedIn, isNotAdmin, adminController.getReports);
router.post('/reports', isNotLoggedIn, isNotAdmin, adminController.deleteReport);


module.exports = router