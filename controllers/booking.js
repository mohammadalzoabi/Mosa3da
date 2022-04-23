const User = require('../models/User')





exports.addSession = (req, res, next) => {
    var newDate = new Date()
    newDate = req.body.sessionTime;
    const duration = req.body.duration;
    console.log(duration)

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
    User.findOne({email: therapistEmail})
                    .then(therapist => { 
                        return req.user.bookTherapist(therapist);
                    })
                    .then(result => {
                        res.redirect('/account');
                    })
                    .catch(err => {
                        const error = new Error(err);
                        error.httpStatusCode = 500;
                        return next(error);
                      });
};


exports.postBooking