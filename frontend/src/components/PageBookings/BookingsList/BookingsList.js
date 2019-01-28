import React from 'react'
import './BookingsList.css'
import Booking from '../Booking/Booking'

const bookingsList = (props) => {
    
    console.table(props.bookings)

    const list = props.bookings.map((booking) => {
        //const onViewEvent = () => props.onViewEvent(event._id)
        return <Booking key={booking._id} booking={booking} />
    })

    return (
        <ul className="bookings__list">
            {list}
        </ul>
    )
}

export default bookingsList