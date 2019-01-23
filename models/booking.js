const mongoose = require('mongoose')
const Schema = mongoose.Schema

module.exports = mongoose.model('Booking', new Schema({
    event: {
        type: Schema.Types.ObjectId,
        ref: 'Event',
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    _id: {
        type: Schema.Types.ObjectId
    }

},
    {
        timestamps: true
    }))
