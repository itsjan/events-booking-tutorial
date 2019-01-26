import React from 'react'
import './EventsList.css'
import Event from '../EventsItem/EventsItem'

const eventsList = (props) => {

    const eventList = props.events.map((event) => {
        return <Event key={event._id} event={event} />
    })

    return (
        <ul className="events__list">
            {eventList}
        </ul>
    )
}

export default eventsList