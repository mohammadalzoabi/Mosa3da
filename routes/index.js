const express = require('express')
const router = express.Router()
const isAuth = require('../config/auth');
const isAuth3 = require('../config/auth3');



router.get('/', isAuth3, (req, res) => res.render('home' , {
}))

router.get('/dashboard', isAuth, (req, res) => res.render('dashboard' , {
    name: req.user.name
}))




module.exports = router