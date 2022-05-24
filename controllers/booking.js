const { createIndexes } = require('../models/User');
const User = require('../models/User')

const {
    sendAppointmentToTherapistEmail,
    sendAppointmentToPatientEmail,
  } = require("../emails/account");



exports.addSession = (req, res, next) => {
    var newDate = new Date()
    newDate = req.body.sessionTime;
    const duration = req.body.duration;


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


exports.postBooking