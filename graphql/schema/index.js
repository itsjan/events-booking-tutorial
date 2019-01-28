const { buildSchema } = require('graphql')

module.exports = buildSchema(`

        type AuthData{
            userId: ID!
            token: String!
            tokenExpiration: Int!
        }

        type Event{
            _id: ID!
            title: String!
            description: String!
            price: Float
            date: String!
            creator: User!      
        } 

        type User{
            _id: ID!
            email: String!
            password: String
            createdEvents: [Event!]
        }

        type Booking{
            _id: ID!
            event: Event!
            user: User!
            createdAt: String!
            updatedAt: String!
        }

        input EventInput {
            title: String!
            description: String!
            price: Float
            date: String!
            
        }

        input UserInput {
            email: String!
            password: String!
        }
# ROOT QUERY #############
        type RootQuery {
            login(email: String!, password: String!): AuthData
            events: [Event!]!
            bookings: [Booking!]!
        }
# ROOT MUTATION ##########
        type RootMutation {          
            createEvent(eventInput: EventInput): Event
            createUser(userInput: UserInput): User
            bookEvent(eventId: ID!): Booking!
            cancelBooking(bookingId: ID!): Event!
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `)