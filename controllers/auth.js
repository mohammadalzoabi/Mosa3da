const User = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport')


// Login Exports
exports.getLogin = (req, res, next) => {
    let message = req.flash('error');
    if(message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('login', {
        path:'/login',
        errorMessage: message,
        oldInput: {
            email: "",
            password: ""
        },
        validationErrors: []
    });
};
exports.postLogin = (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next)
}



// Sign up Exports
exports.getSignup = (req, res, next) => {
    let message = req.flash('error');
    if(message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('signup', {
        path:'/signup',
        errorMessage: message,
        oldInput: {
            name:"",
            email: "",
            password: "",
            confirmPassword: ""
        },
        validationErrors: []
    });
};
exports.postSignup = (req, res, next) => {
    const { name, email, password, confirmPassword } = req.body
    let errors = []

    //Check Required Fields
    if(!name || !email || !password || !confirmPassword) {
        errors.push({msg: 'Please fill the required info'})
    }
    //Check Matching Password
    if(password !== confirmPassword) {
        errors.push({msg: "Passwords do not match"})
    }
    //Check Password Length
    if(password.length < 6) {
        errors.push({msg: "Password must be at least 6 characters"})
    }

    if(errors.length > 0) {
        res.render('signup', {
            errors, name, email, password, confirmPassword
        })
    } else {
        console.log("Registeration Completed!")
        //Validation Pass
        User.findOne({
            email: email
        })
        .then(user => {
            if(user) {
                errors.push({msg: 'User Already Exists'})
                res.render('signup', {
                    errors, name, email, password, confirmPassword
                })
            } else {
                const newUser = new User({
                    name,
                    email,
                    password
                })
                //Hashing The Password
                bcrypt.genSalt(10, (err, salt) => 
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) console.log(err)
                        //Set User Password to Hashed Password
                        newUser.password = hash;
                        //Save User
                        newUser.save()
                            .then(user => {
                                req.flash('success_msg', 'You Are Now Registered')
                                passport.authenticate('local', {
                                    successRedirect: '/dashboard',
                                    failureRedirect: '/signup',
                                    failureFlash: true
                                })(req, res, next)})
                            .catch(err => {
                                console.log(err)
                            })
                }))
            }
        })
    }
}



exports.getLogout = (req, res, next) => {
    req.logout();
    req.flash('success_msg', "Logged out successfully")
    res.redirect('/')
}