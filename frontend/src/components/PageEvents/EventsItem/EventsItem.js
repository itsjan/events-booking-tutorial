import React from 'react'
import './EventsItem.css'
import AuthContext from '../../../context/auth-context'


class eventsItem extends React.Component {
    static contextType = AuthContext


    render() {

        const event = this.props.event
       
        return (
            <li key={event._id} className="events__list-item">
                <div>
                    <h1>{event.title}</h1>
                    <h2>$19.99</h2>

                </div>
                <div>
                    <button className="btn" onClick={this.props.onViewEvent}>VIEW</button>
                    {this.context.userId === event.creator._id ? 
                        <div>You are the creator of this event </div> : 
                        <div> Event by {event.creator.email}</div>}
                </div>
            </li>)
    }
}

export default eventsItem