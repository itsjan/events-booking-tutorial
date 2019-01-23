const User = require('../../models/user')
var bcrypt = require('bcryptjs');           // Password crypt

module.exports = {
    
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
    }

    
}




