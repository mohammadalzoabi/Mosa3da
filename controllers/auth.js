const User = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport')

const fileHelper = require('../util/file');


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
        pageTitle: 'Signup',
        name:'login',
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
        pageTitle: 'Signup',
        errorMessage: message,
        name:'signup',
        oldInput: {
            name:"",
            email: "",
            password: "",
            confirmPassword: "",
            gender: ""
        },
        validationErrors: []
    });
};
exports.postSignup = (req, res, next) => {
    const { name, email, password, confirmPassword, gender } = req.body
    let errors = []

    //Check Required Fields
    if(!name || !email || !password || !confirmPassword || !gender) {
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
                    password,
                    gender
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


// Logout Export
exports.getLogout = (req, res, next) => {
    req.logout();
    req.flash('success_msg', "Logged out successfully")
    res.redirect('/')
}



// Edit Account Exports
exports.getEditAccount = (req, res, next) => {
    User.findOne({email : req.user.email})
        .then(user => {
            res.render('user-profile-edit', {
                user: user, 
                pageTitle: 'Edit Account', 
                path: '/edit-account',
                name: 'Edit Account'
            });
        })
        .catch(err => {
            console.log('didnt find user account, edit account section!')
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
          });
}
exports.postEditAccount = (req, res, next) => {
    const { name, email, gender } = req.body

    const image = req.file
    let errors = []

    //Check Required Fields
    if(!name || !email || !gender) {
        errors.push({msg: 'Cannot leave fields empty'})
    }

        if(errors.length > 0) {
            console.log(errors)
            User.findOne({email : req.user.email})
                .then(user => {
                    res.render('user-profile-edit', {
                        errors: errors,
                        user: user, 
                        pageTitle: 'Account', 
                        path: '/edit-account'
                    });
                })
                .catch(err => {
                    console.log('didnt find user account, edit account section!')
                    const error = new Error(err);
                    error.httpStatusCode = 500;
                    return next(error);
                });
        } else {
            User.findOne({email : req.user.email})
            .then(user => {
                user.name = name;
                user.email = email;
                user.gender = gender;
                if(image) {
                    fileHelper.deleteFile(user.image);
                    user.image = image.path;
                }

                return user.save().
                    then(result => {
                        res.redirect('/account');
                })
            })
            .catch(err => {
                console.log(err)
            });
        }
    }