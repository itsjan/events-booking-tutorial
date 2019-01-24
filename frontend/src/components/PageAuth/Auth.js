import React, { Component } from 'react'
import './Auth.css'

class Auth extends Component {

    state = {
        isLogin : true
    }

    constructor(props) {
        super(props)
        this.emailInput = React.createRef()
        this.passwordInput = React.createRef()
    }

    handleButtonClick = () => {
        this.setState(prevState => {
            return { isLogin : !prevState.isLogin }
        })

    }

    // arrow functions bind "this" to the
    // class instance
    submitHandler = (e) => {
        e.preventDefault()
        const email = this.emailInput.current.value;
        const password = this.passwordInput.current.value;

        if (email.trim().length === 0 || password.trim().length === 0) {
            return
        }

        const loginRequest = {
            query : `
            query {
                login(
                  email   : "${email}"
                  password: "${password}"
                ){
                    userId
                    token
                    tokenExpiration
                }
              }`
        }

        const requestBody = {
            query : `
            mutation {
                createUser(userInput:{
                  email   : "${email}"
                  password: "${password}"
                }){
                  _id
                  email
                }
              }
            `
        }

        fetch('http://localhost:8000/graphql',
            {
                method: 'POST',
                body:  this.state.isLogin? 
                    JSON.stringify(loginRequest) : 
                    JSON.stringify(requestBody),
                headers: {
                    'Content-Type' : 'application/json'
                }
            }).then(res => {               
                if (res.status !== 200 && res.status !== 201) {                 
                    throw new Error('Failed')
                }

                return res.json()
            })
            .then(responseData => {
                console.log(responseData)
                if ( responseData.errors)
                {
                    console.log("SERVER REPORTED AN ERROR", responseData.errors)
                    alert(responseData.errors[0].message)
                }
                if (responseData.data.login)
                {
                    console.log("TOKEN", responseData.data.login.token )
                }
                else if (responseData.data.createUser)
                {
                    console.log("CREATED USER", responseData.data.createUser)
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    render(props) {
        return (
            <form className="auth-form" onSubmit={this.submitHandler}>
                <div className="form-control">
                    <label htmlFor="email">E-mail</label>
                    <input type="email" id="email" ref={this.emailInput} />
                </div>
                <div className="form-control">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" ref={this.passwordInput} />
                </div>
                <div className="form-actions">
                    <button type="submit">{this.state.isLogin? "Login" : "Signup"}</button>
                    <button type="button" onClick={this.handleButtonClick}>Switch to {this.state.isLogin? "Signup" : "Login"}</button>
                </div>
            </form>
        )

    }
}

export default Auth