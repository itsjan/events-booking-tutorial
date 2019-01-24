import React from 'react'
import { NavLink } from 'react-router-dom'
import './MainNav.css'
import AuthContext from '../../context/auth-context'

const mainNavigation = (props) => (
    <AuthContext.Consumer>
        {(context) => {
            console.log('token' , context.token)
            return (
                <header className="main-navigation">
                    <div className="main-navigation__logo">
                        <h1>Eventum</h1>
                    </div>
                    <nav className="main-navigation__nav">
                        <ul>

                            {!context.token &&
                                <li><NavLink to='/auth'>Login</NavLink></li>
                            }
                            <li><NavLink to='/events'>Events</NavLink></li>
                            {context.token &&
                                <li><NavLink to='/bookings'>Bookings</NavLink></li>
                            }
                            {
                                context.token && <div>Logged in</div>
                            }
                        </ul>
                    </nav>

                </header>

            )
        }}

    </AuthContext.Consumer>
)

export default mainNavigation