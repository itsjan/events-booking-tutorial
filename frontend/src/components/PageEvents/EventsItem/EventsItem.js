import React from 'react'
import './EventsItem.css'

const eventsItem = ({ event }) => {
    return <li key={event._id} className="events__list-item">{event.title}</li>
}

export default eventsItem