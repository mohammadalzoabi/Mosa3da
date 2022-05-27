exports.get404 = (req, res, next) => {
    res.render('404', {
        pageTitle: 'Page Not Found',
        pageName: '404',
        path:'/404'
    }); 
};

exports.get500 = (req, res, next) => {
    res.render('500', {
        pageTitle: 'Error',
        path:'/500',
        pageName: '500'
    }); 
};