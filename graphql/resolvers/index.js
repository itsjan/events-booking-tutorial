const Event = require('../../models/event')
const User = require('../../models/user')
const Booking = require('../../models/booking')

const { date2String} = require('../../helpers/date')

var bcrypt = require('bcryptjs');           // Password crypt


function transformEvent(event) {
    return {
        ...event._doc,
        _id: event.id,
        creator: singleUser(event.creator),
        date:  date2String(event.date)
    }
}



const singleUser = (userId) => () =>
    User.findById(userId)
        .then(user => {
            return {
                ...user._doc,
                _id: user.id,
                password: null,
                createdEvents: events(user._doc.createdEvents)
            }
        })
        .catch(err => { throw err })

const singleEvent = (eventId) => async () => {
    try {
        const event = await Event.findById(eventId);
        return transformEvent(event)
    }
    catch (err) {
        throw err
    }
}

const events = eventIds => () => {
    return Event.find({ _id: { $in: eventIds } })
        .then(events => {

            return events.map(event => {
                return transformEvent(event)
            })
        })
        .catch(err => { throw err })

}

/*
      R E S O L V E R S 

*/

module.exports = {
    events: () => {
        return Event.find()
            //.populate('creator') // #7
            .then(events => {
                return events.map(event => {
                    return transformEvent(event)
                })
            })
            .catch(err => {
                console.log(err)
                throw err
            })
    },

    bookings: async () => {
        try {
            const bookings = await Booking.find()
            return bookings.map(b => {
                return {
                    ...b._doc,
                    _id: b.id,
                    event: singleEvent(b.event),
                    user: singleUser(b.user),
                    createdAt: date2String( b._doc.createdAt), //.toISOString(),
                    updatedAt: date2String (b._doc.updatedAt), //.toISOString(),
                }

            })
        } catch (err) {
            throw err
        }
    },

    createEvent: ({ eventInput }) => {

        let createdEvent

        const event = new Event({
            title: eventInput.title,
            description: eventInput.description,
            price: +eventInput.price,
            date: new Date(eventInput.date),
            creator: '5c47172689144d845c7d2ff8' // temporary hardcoded _id
        })

        return event
            .save()
            .then((result) => {
                createdEvent = { ...result._doc, _id: result._doc._id.toString() }
                // Find the user who created the event
                return User.findById('5c47172689144d845c7d2ff8')
            })
            .then(user => {
                if (!user) {
                    throw new Error('Invalid user id')
                }
                user.createdEvents.push(event)
                return user.save()
            })
            .then(() => createdEvent)
            .catch((err) => {
                console.log(err)
                throw err
            })
    },

    createUser: ({ userInput }) => {
        console.log("CREATE USER", userInput)

        // HUOMAA return heti kärkeen!!!
        return User.findOne({ email: userInput.email })
            .then(user => {
                if (user) {
                    throw new Error('User already exists')
                }
                console.log("HASHING PASSWORD...")
                return bcrypt.hash(userInput.password, 12)
            })
            .then(hashedPassword => {
                console.log("GOT HASH ", hashedPassword)
                const user = new User({
                    email: userInput.email,
                    password: hashedPassword
                })
                return user
                    .save()
                    .then(result => {
                        console.log("USER SAVED", result)
                        return {
                            ...result._doc,
                            _id: result._id,
                            password: null
                        }
                    })
                    .catch((err) => {
                        console.log(err)
                        throw err
                    })
            })
            .catch(err => {
                throw err
            })
    },

    bookEvent: async ({ eventId }) => {
        console.log(`BOOK EVENT ${eventId} `)
        const event = await Event.findOne({ _id: eventId })

        const newBooking = new Booking({
            event: event,
            user: '5c47172689144d845c7d2ff8' // temporary hardcoded _id
        })

        const result = await newBooking.save()
        return {
            ...result._doc, _id: result.id,
            event: singleEvent(eventId),
            user: singleUser(result._doc.user),
            createdAt: result._doc.createdAt.toISOString(),
            UpdatedAt: result._doc.updatedAt.toISOString(),
        }
    },

    cancelBooking: async ({ bookingId }) => {
        console.log(`CANCEL BOOKING ${bookingId}`)
        try {
            const booking = await Booking.findOne({ _id: bookingId }).populate('event')

            const event = {
                ...booking.event._doc,
                _id: booking.event._doc.id,
                creator: singleUser(booking.event._doc.creator)
            }

            console.log('EVENT : ', event, event.description)
            const result = await Booking.deleteOne({ _id: bookingId })

            return event

        } catch (err) {
            throw err

        }
    }

}




