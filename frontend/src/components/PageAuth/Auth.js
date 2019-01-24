import React, { Component } from 'react'
import './Auth.css'

class Auth extends Component {

    constructor(props) {
        super(props)
        this.emailInput = React.createRef()
        this.passwordInput = React.createRef()
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
                body: JSON.stringify(requestBody),
                headers: {
                    'Content-Type' : 'application/json'
                }
            }).then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    console.log(res.json())
                    throw new Error('Failed')
                }
                return res.json()
            })
            .then(responseData => {
                console.log(responseData)
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
                    <button type="submit">Signup</button>
                    <button type="button">Login</button>
                </div>
            </form>
        )

    }
}

export default Auth