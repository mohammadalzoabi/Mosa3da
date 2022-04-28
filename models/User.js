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
        default: 'https://i.imgur.com/fUWz80K.jpg'
    },
    cv: {
        fileName: { type: String, required: false },
        filePath: { type: String, required: false },
        fileType: { type: String, required: false },
    },
    gender: {
        type: String,
        required: true
    },
    // birthDate: {
    //     type: Date,
    //     required: true
    // },
    
    joinDate: {
        type: Date,
        default: Date.now
    },
    role: {
        type: String,
        default: "customer"
    },
    acceptedTherapist: {
        type: String,
        default: "No"
    },

    bookings:{
        booking: [{
            bookingId: {
                type: Schema.Types.ObjectId,
                ref:'User',
                required: true
            },

            dateAndTime: {
                type: Date,
                required: true
            },

            duration: {
                type: String,
                required: true
            },

            therapistName: {
                type: String,
                required: true
            },

            customerName: {
                type: String,
                required: true
            }
        }]
    },


    availableDates: {
            availableDate: [{
                time: {
                    type: Date,
                    required: true
                },

                duration: {
                    type: String,
                    required: true
                }
        }]
    }




})

UserSchema.methods.bookTherapist = function(therapist, date, duration) {

    const booked = [...this.bookings.booking]
    booked.push({bookingId: therapist._id, dateAndTime: date, duration: duration, therapistName: therapist.name, customerName: this.name})
    const updatedBooked = {booking: booked};
    this.bookings = updatedBooked

    const sold = [...therapist.bookings.booking]
    sold.push({bookingId: this._id, dateAndTime: date, duration: duration, therapistName: therapist.name, customerName: this.name})
    const updatedSold = {booking: sold};
    therapist.bookings = updatedSold

    return therapist.save(), this.save();

}




UserSchema.methods.addSession = function(newDate, duration) {

    const date = [...this.availableDates.availableDate]
    date.push({time: newDate, duration: duration})
    const updatedDates = {availableDate: date}
    this.availableDates = updatedDates

     
    this.markModified('anything')
    return this.save();
}

module.exports =  mongoose.model('User', UserSchema)