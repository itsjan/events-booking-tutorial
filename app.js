const express = require('express')
const bodyParser = require('body-parser')   // get JSON from requests
const graphqlHttp = require('express-graphql')
const mongoose = require('mongoose')        // Build mongoDB Schemas
const app = express()
const graphql_schema = require('./graphql/schema')
const graphql_resolvers = require('./graphql/resolvers')

app.use(bodyParser.json())

app.use('/graphql', graphqlHttp({
    schema: graphql_schema,
    rootValue: graphql_resolvers,
    graphiql: true,
    /*context: { startTime: Date.now() },
    extensions*/
}))

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0-huh2k.gcp.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`)
    .then(() => {
        console.log('[     Connected to MongoDB     ]')
        app.listen(3000)
    })
    .catch(err => console.log(JSON.stringify(err)))
