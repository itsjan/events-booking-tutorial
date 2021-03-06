import React from 'react'
import { NavLink } from 'react-router-dom'
import './MainNav.css'
import AuthContext from '../../context/auth-context'

const mainNavigation = (props) => (
    <AuthContext.Consumer>
        {(context) => {
            console.log('token', context.token)
            return (
                <header className="main-navigation">
                    <div className="main-navigation__logo">
                        <h1>Eventum</h1>
                    </div>
                    <nav className="main-navigation__items">
                        <ul>


                            <li><NavLink to='/events'>Events</NavLink></li>
                            {context.token &&
                                <React.Fragment>
                                    <li><NavLink to='/bookings'>Bookings</NavLink></li>
                                    <li><button onClick={context.logout}>Log Out</button></li>
                                </React.Fragment>

                            }
                            {!context.token &&
                                <li><NavLink to='/auth'>Login</NavLink></li>
                            }
                        </ul>
                    </nav>

                </header>

            )
        }}

    </AuthContext.Consumer>
)

export default mainNavigation