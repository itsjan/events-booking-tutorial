import React from 'react'
import './EventsList.css'
import Event from '../EventsItem/EventsItem'

const eventsList = (props) => {
    
    console.table(props.events)

    const eventList = props.events.map((event) => {
        const onViewEvent = () => props.onViewEvent(event._id)
        return <Event key={event._id} event={event}  onViewEvent={onViewEvent} />
    })

    return (
        <ul className="events__list">
            {eventList}
        </ul>
    )
}

export default eventsList