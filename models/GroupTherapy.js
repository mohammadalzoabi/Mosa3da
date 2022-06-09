const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const GroupTherapySchema = new Schema({

    roomName: {
            type: String,
            required: true
    },

    roomTime: {
        type: String,
        required: true
    },

    roomDate: {
        type: String,
        required: true
    },

    roomDateInNumber: {
        type: String,
        required: true
    },

    roomDuration: {
        type: String,
        required: true
    },

    roomTherapist: {
        type: String,
        required: true
    }

})


module.exports =  mongoose.model('GroupTherapy', GroupTherapySchema)