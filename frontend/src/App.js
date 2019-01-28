import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'
import AuthPage from './components/PageAuth/AuthPage'
import Events from './components/PageEvents/Events'
import BookingsPage from './components/PageBookings/BookingsPage'
import MainNav from './components/Navigation/MainNav'
import AuthContext from './context/auth-context'

import './App.css'
import './index.css'

class App extends Component {

  state = {
    token: null,
    userId: null
  }

  login = (token, tokenExpiration, userId) => {
    this.setState({ token, userId })
  }
  logout = () => {
    this.setState({ token: null, userId: null })
  }

  render() {
    return (

      <BrowserRouter>
        <React.Fragment>
          <AuthContext.Provider value={{
            token: this.state.token,
            userId: this.state.userId,
            login: this.login, 
            logout: this.logout
          }}>
            <MainNav />
            <main className="main">
              <Switch>
                {!this.state.token && <Redirect from='/' to='/auth' exact />}
                {this.state.token && <Redirect from='/auth' to='/events' />}
                {!this.state.token && <Route path='/auth' component={AuthPage} />}
                <Route path='/events' component={Events} />
                {this.state.token && <Route path='/bookings' component={BookingsPage} />}
              </Switch>
            </main>
          </AuthContext.Provider>

        </React.Fragment>
      </BrowserRouter>


    )
  }
}

export default App;
