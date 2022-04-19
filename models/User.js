const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false,
        default: "https://i.imgur.com/fUWz80K.jpg"
    },
    gender: {
        type: String,
        required: true
    },
    // birthDate: {
    //     type: Date,
    //     required: true
    // },
    date: {
        type: Date,
        default: Date.now
    },
    role: {
        type: String,
        default: "customer"
    }
})

module.exports =  mongoose.model('User', UserSchema)