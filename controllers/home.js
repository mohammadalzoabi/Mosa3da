const express = require('express')
const User = require('../models/User')

const ITEMS_PER_PAGE = 9;

// Get Index
exports.getIndex = (req, res, next) => {
    res.render('home', {
        pageName: 'home',
        path: '/',
        pageTitle: 'Mosa3da',
    })
}


// Get Dashboard
exports.getDashboard = (req, res, next) => {
    User.findOne({email : req.user.email})
        .then(user => {
            res.render('dashboard', {
                user: user,
                sessions: user.bookings,
                pageTitle: 'Dashboard', 
                path: '/dashboard',
                pageName: 'dashboard',
            });
        })
        .catch(err => {
            console.log('didnt find user account!')
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
          });
}



// Get Therapists List
exports.getTherapists = (req, res, next) => {
    const page = +req.query.page || 1
    let totalTherapists

    User.find().countDocuments()
        .then(numTherapists => {
            totalTherapists = numTherapists
            return User.find()
                .skip((page-1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE)
        })
        .then(users => {
            res.render('therapist-List', {
                user: req.user,
                pageName:'therapist list',
                usersAll: users,
                pageTitle: 'Therapist List',
                path:'/dashboard',
                currentPage: page,
                hasNextPage: ITEMS_PER_PAGE * page < totalTherapists,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalTherapists / ITEMS_PER_PAGE)
            })
        })
        .catch(err => {
            console.log(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}

// Get Therapist Account
exports.getTherapist = (req, res, next) => {
    const therapistId = req.params.therapistId;
    User.findById(therapistId)
            .then(therapist => {
                res.render('therapistAccount', {
                    therapist: therapist,
                    availableDates: therapist.availableDates,
                    user: req.user,
                    pageTitle: therapist.name, 
                    path: '/therapists',
                    pageName: 'therapist list'
            })
        })
        .catch(err => {
            console.log(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
    }







exports.getMessages = (req, res, next) => {
    res.render('messages', {
        pageTitle: "therapist.name", 
        path: '/messages',
        pageName: 'messages',
        user: req.user,
        therapistCount: req.user.therapists.therapist.length,
})
}

exports.getChat = (req, res, next) => {
    res.render('chat', {
        pageTitle: "therapist.name", 
        path: '/messages',
        pageName: 'messages',
        user: req.user
})
}






exports.getAccount = (req,res,next) => {

    User.findOne({email : req.user.email})
        .then(user => {
            res.render('user-profile', {
                user: user, 
                pageTitle: 'Account', 
                path: '/account',
                pageName: 'account'
            });
        })
        .catch(err => {
            console.log('didnt find user account!')
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
          });
}