const Booking = require('../../models/booking')
const Event = require('../../models/event')
const User = require('../../models/user')
const {transformBooking, transformUser} = require ('./merge')

module.exports = {

    bookings: async (args, req) => {
        if (!req.isAuth)
        {
            throw Error('AUTH ERROR')
        }
        try {

            const bookings = await Booking.find({ user : req.userId   })
            return bookings.map(booking => {
                return transformBooking(booking) 
            })
        } catch (err) {
            throw err
        }
    },

    bookEvent: async ({ eventId }, req) => {
        if (!req.isAuth)
        {
            throw Error('AUTH ERROR')
        }
        console.log(`BOOK EVENT ${eventId} `)
        const event = await Event.findOne({ _id: eventId })

        const newBooking = new Booking({
            event: event,
            user:  req.userId // '5c47172689144d845c7d2ff8' // temporary hardcoded _id
        })

        const booking = await newBooking.save()
        return transformBooking(booking)
    },

    cancelBooking: async ({ bookingId }, req) => {
        if (!req.isAuth)
        {
            throw Error('AUTH ERROR')
        }
        console.log(`CANCEL BOOKING ${bookingId}`)
        try {
            const booking = 
                await Booking.findOne({ _id: bookingId })
                .populate('event')
            
            if ( !booking)
                throw Error('Booking does not exist')

            const creator = await User.findOne({ _id: booking.event.creator})

            console.log('BOOKING',booking)

            const event = {
                ...booking.event._doc,
                _id: booking.event._doc._id,
                creator: transformUser(creator)
            }

            console.log('EVENT : ', event)
            const result = await Booking.deleteOne({ _id: bookingId })

            return event

        } catch (err) {
            console.log("ERROR IN CANCEL BOOKING -->", err)
            throw err
        }
    }

}

