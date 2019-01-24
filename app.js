const express = require('express')
const bodyParser = require('body-parser')   // get JSON from requests
const graphqlHttp = require('express-graphql')
const mongoose = require('mongoose')        // Build mongoDB Schemas
const app = express()
const graphql_schema = require('./graphql/schema')
const graphql_resolvers = require('./graphql/resolvers')
const auth = require('./middleware/auth')

// Configure Middleware

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200)
    }
    next()
})
app.use(bodyParser.json())
app.use(auth)
app.use('/graphql', graphqlHttp({
    schema: graphql_schema,
    rootValue: graphql_resolvers,
    graphiql: true,
}))

// Connect to database
mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0-huh2k.gcp.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`,
    { useNewUrlParser: true })
    .then(() => {
        console.log('[     Connected to MongoDB     ]')
        app.listen(8000)
    })
    .catch(err => console.log(JSON.stringify(err)))
