const multer = require('multer')
const path = require('path')

//Multer Config
const fileStorage = multer.diskStorage({
    destination:(req, file, cb) => {
        cb(null, 'cvs');
    },
    filename: (req, file, cb) => {
        let ext = path.extname(file.originalname)
        cb(null, req.body.name + '_CV' + ext);
    }
});
const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'application/pdf'){
        cb(null, true);
    } else {
        cb(null, false);
    }
}


var cvUpload = multer({
    storage: fileStorage,
    fileFilter: fileFilter
})

module.exports = cvUpload