import React, { Component } from 'react'
import Backdrop from '../Backdrop/Backdrop'
import Modal from '../Modal/Modal'
import Spinner from '../Spinner/Spinner'

import './Events.css'
import AuthContext from '../../context/auth-context'



class Events extends Component {
    static contextType = AuthContext

    state = {
        showModal: false,
        events: [{ _id: 'ID', title: 'LOADING EVENTS' }],
        isLoading: false,
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
                console.log("RESPONSEDATA", responseData)
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

    constructor(props) {
        super(props)
        this.eventTitleInput = React.createRef()
        this.eventDescriptionInput = React.createRef()
        this.eventPriceInput = React.createRef()
        this.eventDateInput = React.createRef()
    }

    toggleModal = () => {
        this.setState({
            showModal: !this.state.showModal
        })
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
                    // withCredentials: true,
                    // credentials: 'include',
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
                .then(responseData => {
                    this.toggleModal()
                    this.fetchEvents()
                    console.log("RESPONSEDATA", responseData)
                    if (responseData.errors) {
                        console.log("SERVER REPORTED AN ERROR", responseData.errors)
                        alert(responseData.errors[0].message)
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

        const eventList = this.state.events.map((event) => {
            return <li key={event._id} className="events__list-item">{event.title}</li>
        })

        console.log("EVENTLIST ", eventList)
        return (
            <React.Fragment>
                {(this.state.showModal
                    || this.state.isLoading) &&
                    <Backdrop />}

                {this.state.showModal &&
                    <Modal title="Modal Title"
                        canCancel="true"
                        onCancel={this.toggleModal}
                        canConfirm="true"
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
                <div className="events-control">
                    {this.state.isLoading && <Spinner />}
                    <h1>Events</h1>
                    {this.context.token && <button className="btn" onClick={this.toggleModal}>Create Event</button>}

                    <ul className="events__list">
                        {eventList}
                    </ul>

                </div>
            </React.Fragment>
        )
    }
}

export default Events