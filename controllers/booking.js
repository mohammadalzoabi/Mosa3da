const { createIndexes } = require('../models/User');
const User = require('../models/User')

const {
    sendAppointmentToTherapistEmail,
    sendAppointmentToPatientEmail,
  } = require("../emails/account");


// Add New Available Session for Therapist
exports.addSession = (req, res, next) => {
    var newDate = new Date()
    newDate = req.body.sessionTime;
    const duration = req.body.duration;

    let errors = []

    if(!newDate || !duration) {
        errors.push({ msg: "Please Select a Date" });
    }

    if(errors.length > 0) {
        res.render("user-profile", {
            errors,
            user: req.user,
            pageTitle: "Account",
            pageName: "account",
          });
    } else {
        User.findOne({email: req.user.email})
                .then(therapist => {
                    return req.user.addSession(newDate, duration) 
                })
                .then(result => {
                    
                    res.redirect('/account');
                })
                .catch(err => {
                    const error = new Error(err);
                    error.httpStatusCode = 500;
                    return next(error);
                  });
    }


    
}

// Book a Session
exports.bookTherapist = (req, res, next) => {

    const therapistEmail = req.body.userEmail;
    let therapistName
    const date = req.body.date;
    const duration = req.body.duration;
    const sessionId = req.body.sessionId;

    
    User.findOne({email: therapistEmail})
                    .then(therapist => { 
                        therapistName = therapist.name
                        req.user.bookTherapist(therapist, date, duration);
                        //therapist.availableDates.availableDate.createIndex({"Time": 1}, {expireAfterSeconds: 0})
                        return therapist.availableDates.availableDate.pull({_id: sessionId})
                    })
                    .then(result => {
                        sendAppointmentToTherapistEmail(therapistEmail, therapistName, req.user.name, date, duration)
                        sendAppointmentToPatientEmail(req.user.email, req.user.name, therapistName, date, duration)
                        res.redirect('/dashboard');
                    })
                    .catch(err => {
                        const error = new Error(err);
                        error.httpStatusCode = 500;
                        return next(error);
                      });
};

// Get Payment Page
exports.getPayment = (req, res, next) => {
    const therapistEmail = req.query.userEmail;
    var therapistName
    const date = req.query.date;
    const duration = req.query.duration;
    const sessionId = req.query.sessionId;

    User.findOne({email: therapistEmail})
                    .then(therapist => { 
                        therapistName = therapist.name
                        res.render('payment', {
                            user: req.user,
                            therapistName: therapistName,
                            therapistEmail: therapistEmail,
                            date: date,
                            duration: duration,
                            sessionId: sessionId
                        })
                    })
                    .catch(err => {
                        const error = new Error(err);
                        error.httpStatusCode = 500;
                        return next(error);
                      });

    
}

// Delete Date
exports.deleteSession = (req, res, next) => {
    const email = req.body.email;
    const sessionId = req.body.session
    var therapist

    console.log(sessionId);


    User.findOne({email: email})
                    .then(user => { 
                        user.availableDates.availableDate.pull({_id: sessionId})
                        return user.save()
                        
                    })
                    .then(results => { 
                        req.flash("success_msg", "Session Deleted");
                        res.redirect('/account')
                    })
                    .catch(err => {
                        const error = new Error(err);
                        error.httpStatusCode = 500;
                        return next(error);
                      });

}

exports.postBooking