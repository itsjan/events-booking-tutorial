const Event = require('../../models/event')
const User = require('../../models/user')
const {transformEvent} = require ('./merge')

module.exports = {

    events: () => {
        return Event.find()
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

    createEvent: ({ eventInput }, req) => {

        if (!req.isAuth)
        {
            throw Error('AUTH ERROR')
        }

        let createdEvent

        console.log(req)

        const event = new Event({
            title: eventInput.title,
            description: eventInput.description,
            price: +eventInput.price,
            date: new Date(eventInput.date),
            creator: req.userId //'5c47172689144d845c7d2ff8' // temporary hardcoded _id
        })

        return event
            .save()
            .then((result) => {
                createdEvent = transformEvent(result)
                return User.findById(req.userId)
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

}


