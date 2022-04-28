module.exports = (req, res, next) => {
    if(req.isAuthenticated()) {
        return res.redirect('/dashboard');
    } else {
    }
    next();
}