import React, { Component } from 'react'
import Backdrop from '../Backdrop/Backdrop'
import Modal from '../Modal/Modal'
import './Events.css'


class Events extends Component {

    state = {
        showModal: false
    }

    toggleModal = () => {
        this.setState({
            showModal: !this.state.showModal
        })
    }

    createEvent = () => {
        //get values ..
        //create event
    }

    render(props) {

        return (
            <React.Fragment>
                {this.state.showModal &&
                    <Backdrop />}
                {this.state.showModal &&
                    <Modal title="Modal Title"
                        canCancel="true"
                        onCancel={this.toggleModal}
                        canConfirm="true"
                        onConfirm={this.createEvent}>
                        <p>Modal Content</p>
                    </Modal>
                }
                <div className="events-control">
                    <h1>Events</h1>
                    <button className="btn" onClick={this.toggleModal}>Create Event</button>
                </div>
            </React.Fragment>
        )
    }
}

export default Events