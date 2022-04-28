module.exports = (req, res, next) => {
    if(req.user.role !== 'therapist') {
        return res.redirect('/dashboard');
    } else {
    }
    next();
}