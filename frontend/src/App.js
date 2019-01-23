import React, { Component } from 'react';
import { BrowserRouter, Route, Link, Redirect, Switch } from 'react-router-dom'
import Auth from './components/Auth'
import Events from './components/Events'
import Bookings from './components/Bookings'

import './App.css';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <ul>
            <li><Link to='/'>Home</Link></li>
            <li><Link to='/auth'>Login</Link></li>
            <li><Link to='/events'>Events</Link></li>
            <li><Link to='/bookings'>Bookings</Link></li>
          </ul>
          <Switch>  
            <Redirect from='/' to="/auth" exact />        
            <Route  path='/auth' component={Auth} />
            <Route  path='/events' component={Events} />
            <Route  path='/bookings' component={Bookings} />
            
          </Switch>
        </div>
      </BrowserRouter>
    )
  }
}

export default App;
