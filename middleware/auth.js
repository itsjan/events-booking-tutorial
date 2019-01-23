const jwt = require('jsonwebtoken')

module.exports = async (req, res, next) => {

    req.isAuth = false

    const authHeader = req.get('Authorization')
    console.log('AUTH', authHeader)

    if (authHeader){
        const token = authHeader.split(' ')[1]
        console.log('AUTH TOKEN : ', token)
        if (token && token !=='') {
            
            try {
                const decodedToken = await
                    jwt.verify(token, process.env.AUTH_CRYPTOKEY)
                console.log('DECODED TOKEN', decodedToken)
                if (decodedToken && decodedToken.userId) {                 
                    req.isAuth= true;
                    req.userId = decodedToken.userId
                    return next()
                }
            }
            catch {
                return next()

            }
        }
    }
    console.log('USER NOT AUTHD')
    
    return next()


}