import React from 'react'

export default React.createContext({
    token: null,
    userId: null,
    // Adding functions here will help with 
    // autocompletion
    login: (token, tokenExpiration, userId) => {},
    logout: () => {} 

})