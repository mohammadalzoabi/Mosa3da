const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const MessagesSchema = new Schema({

    roomId: {
            type: String,
            required: true
    },

    messages: {
        message: [{
            sender: {
                type: String,
                required: true
            },

            message: {
                type:String,
                required: true
            },

            time: {
                type: String,
                required: true
            }
        }]
    }

})


module.exports =  mongoose.model('Messages', MessagesSchema)