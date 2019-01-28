import React from 'react'
import './Booking.css'
import AuthContext from '../../../context/auth-context'

class eventsItem extends React.Component {
    static contextType = AuthContext

    render() {

        const booking = this.props.booking
       
        return (
            <li key={booking._id} className="bookings__list-item">
                <div>
                    <h1>{ booking.event.title }</h1>
                    <div className="events__list-item_price">${booking.event.price} - {new Date(booking.event.date).toLocaleDateString()}</div>

                </div>

            </li>)
    }
}

export default eventsItem