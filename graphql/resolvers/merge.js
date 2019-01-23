const User = require('../../models/user')
const Event = require('../../models/event')
const { date2String } = require('../../helpers/date')

function transformEvent(event) {
    return {
        ...event._doc,
        //_id: event.id,
        creator: singleUser(event.creator),
        date: date2String(event.date)
    }
}

function transformBooking(booking) {
    return {
        ...booking._doc,
        //_id: booking.id,
        event: singleEvent(booking.event),
        user: singleUser(booking.user),
        createdAt: date2String(booking._doc.createdAt),
        updatedAt: date2String(booking._doc.updatedAt),
    }
}

function transformUser(user) {
    return {
        ...user._doc,
        //_id: user.id,
        password: null,
        createdEvents: events(user._doc.createdEvents)
    }   
}

const singleUser = (userId) => () =>
    User.findById(userId)
        .then(user => {
            return transformUser(user) 
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

exports.transformEvent = transformEvent
exports.transformBooking = transformBooking
exports.transformUser = transformUser