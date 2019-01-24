import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'
import Auth from './components/PageAuth/Auth'
import Events from './components/Events'
import Bookings from './components/Bookings'
import MainNav from './components/Navigation/MainNav'

import './App.css';

class App extends Component {
  render() {
    return (

      <BrowserRouter>
        <React.Fragment>
          <MainNav />
          <main className="main">
            <Switch>
              <Redirect from='/' to="/auth" exact />
              <Route path='/auth' component={Auth} />
              <Route path='/events' component={Events} />
              <Route path='/bookings' component={Bookings} />
            </Switch>
          </main>
        </React.Fragment>
      </BrowserRouter>


    )
  }
}

export default App;
