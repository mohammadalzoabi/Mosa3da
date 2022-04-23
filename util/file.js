const fs = require('fs');

const deleteFile = (filePath) => {
    fs.unlink(filePath, (err) => {
    })
}

exports.deleteFile = deleteFile;