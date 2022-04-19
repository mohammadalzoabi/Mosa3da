const express = require('express')
const User = require('../models/User')
const router = express.Router()
const isAuth = require('../config/auth');
const isAuth3 = require('../config/auth3');

const siteController = require('../controllers/home');

router.get('/', isAuth3, siteController.getIndex)

router.get('/dashboard', isAuth, siteController.getDashboard)

router.get('/therapists', siteController.getTherapists)

router.get('/account', isAuth, siteController.getAccount)


module.exports = router