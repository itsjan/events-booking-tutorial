import React, { Component } from 'react'
import Backdrop from '../Backdrop/Backdrop'
import Modal from '../Modal/Modal'
import Spinner from '../Spinner/Spinner'
import EventsList from './EventsList/EventsList'
import './Events.css'
import AuthContext from '../../context/auth-context'

class Events extends Component {
    static contextType = AuthContext

    state = {
        isCreatingNewEvent: false,
        isViewingEvent: null,
        events: [],
        isLoading: false,
    }

    constructor(props) {
        super(props)
        this.eventTitleInput = React.createRef()
        this.eventDescriptionInput = React.createRef()
        this.eventPriceInput = React.createRef()
        this.eventDateInput = React.createRef()
    }

    componentDidMount() {
        this.fetchEvents()
    }

    fetchEvents() {

        this.setState({ isLoading: true })
        const request = {
            query: `
            query {
                events 
                {
                    _id
                    title
                    description
                    price
                    date
                    creator {
                        _id
                        email
                    }
                }
              }
              `
        }

        fetch('http://localhost:8000/graphql',
            {
                method: 'POST',

                body: JSON.stringify(request),
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then(res => {
                this.setState({ isLoading: false })

                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Failed')
                }
                return res.json()
            })
            .then(responseData => {
                this.setState({
                    events: responseData.data.events
                })

                if (responseData.errors) {
                    console.log("SERVER REPORTED AN ERROR", responseData.errors)
                    alert(responseData.errors[0].message)
                }
            })
            .catch(err => {
                this.setState({ isLoading: false })
                console.log(err)
            })

    }



    toggleIsCreatingNewEvent = () => {
        this.setState({
            isCreatingNewEvent: !this.state.isCreatingNewEvent
        })
    }

    viewEvent = (eventId) => {
        console.log("VIEV EVENT ", eventId)
        const isViewingEvent = this.state.events.find(event => event._id === eventId)
        this.setState({
            isViewingEvent
        })

    }

    cancelViewEvent = () => {
        this.setState({
            isViewingEvent: null
        })
    }

    bookEvent = () => {
        console.log("BOOK EVENT", this.state.isViewingEvent._id)
        this.cancelViewEvent()

    }


    createEvent = () => {

        //get values ..
        const eventTitle = this.eventTitleInput.current.value
        const eventDescription = this.eventDescriptionInput.current.value
        const eventPrice = parseFloat(this.eventPriceInput.current.value)
        const eventDate = new Date(this.eventDateInput.current.value).toISOString()

        const event = { eventTitle, eventDescription, eventPrice, eventDate }
        console.log(event)

        const createEventRequest = {
            query: `
            mutation {
                createEvent(eventInput: { title:"${eventTitle}" description:"${eventDescription}"  price:${eventPrice} date:"${eventDate}"}) 
                {
                    _id
                    title
                    description
                    price
                    date
                    creator {
                        _id
                        email
                    }
                }
              }
              `
        }

        console.log(createEventRequest)

        if (eventTitle.trim() !== ''
            && eventDescription.trim() !== ''
            && eventDate.trim() !== '') {

            //create event
            var bearer = 'Bearer ' + this.context.token;

            fetch('http://localhost:8000/graphql',
                {
                    method: 'POST',
                    body: JSON.stringify(createEventRequest),
                    headers: {
                        'Authorization': bearer,
                        'Content-Type': 'application/json',
                    }
                }).then(res => {
                    if (res.status !== 200 && res.status !== 201) {
                        throw new Error('Failed')
                    }

                    return res.json()
                })
                .then(resData => {
                    if (resData.errors) {
                        console.log("SERVER REPORTED AN ERROR", resData.errors)
                        alert(resData.errors[0].message)
                    }
                    else {
                        this.toggleIsCreatingNewEvent()
                        this.setState(prevState => {
                            const updatedEvents = [...prevState.events];
                            updatedEvents.push({
                                _id: resData.data.createEvent._id,
                                title: resData.data.createEvent.title,
                                description: resData.data.createEvent.description,
                                date: resData.data.createEvent.date,
                                price: resData.data.createEvent.price,
                                creator: {
                                    _id: this.context.userId
                                }
                            });
                            return { events: updatedEvents };
                        });


                    }
                })
                .catch(err => {
                    console.log(err)
                })
        }
        else {
            console.log("Missing inputs")
        }
    }

    render(props) {
        return (
            <React.Fragment>
                {(this.state.isCreatingNewEvent
                    || this.state.isLoading
                    || this.state.isViewingEvent) &&
                    <Backdrop />}

                {this.state.isCreatingNewEvent &&
                    <Modal title="Create a New Event"
                        canCancel="true"
                        onCancel={this.toggleIsCreatingNewEvent}
                        canConfirm="true"
                        confirmButtonText="Create Event"
                        onConfirm={this.createEvent}>
                        <form>
                            <div className="form-control">
                                <label htmlFor="eventTitleInput">Event title</label>
                                <input id="eventTitleInput" type="text" ref={this.eventTitleInput}></input>
                            </div>
                            <div className="form-control">
                                <label htmlFor="eventDescriptionInput">Description</label>
                                <textarea id="eventDescriptionInput" type="text" ref={this.eventDescriptionInput}></textarea>
                            </div>
                            <div className="form-control">
                                <label htmlFor="eventPriceInput">Price</label>
                                <input id="eventPriceInput" type="number" ref={this.eventPriceInput}></input>
                            </div>
                            <div className="form-control">
                                <label htmlFor="eventDateInput">Date</label>
                                <input id="eventDateInput" type="datetime-local" ref={this.eventDateInput}></input>
                            </div>
                        </form>
                    </Modal>
                }

                {this.state.isViewingEvent &&
                    <Modal title={this.state.isViewingEvent.title}
                        canCancel="true"
                        onCancel={this.cancelViewEvent}
                        canConfirm={true && this.context.token}
                        confirmButtonText="Book Event"
                        onConfirm={this.bookEvent}>
                        <div>{this.state.isViewingEvent.description}</div>
                        <div>${this.state.isViewingEvent.price}</div>
                    </Modal>
                }

                <div className="events-control">
                    <h1>Events</h1>
                    {this.state.isLoading && <Spinner />}
                    {this.context.token && <button className="btn" onClick={this.toggleIsCreatingNewEvent}>Create Event</button>}
                    <EventsList events={this.state.events} onViewEvent={this.viewEvent} />

                </div>
            </React.Fragment>
        )
    }
}

export default Events