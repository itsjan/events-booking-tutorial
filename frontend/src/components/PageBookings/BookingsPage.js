import React, { Component } from 'react'
import Backdrop from '../Backdrop/Backdrop'
import Spinner from '../Spinner/Spinner'
import Modal from '../Modal/Modal'
import AuthContext from '../../context/auth-context'
import BookingsList from './BookingsList/BookingsList'
import './BookingsPage.css'


class BookingsPage extends Component {

    static contextType = AuthContext

    constructor(props) {
        super(props)
        this.state = {
            bookings: [],
            isCancelingBooking: null,
            isLoading: false,
        }
    }


    startCancelBooking = (bookingId) => {
        const isCancelingBooking = this.state.bookings.find(booking => booking._id === bookingId)
        this.setState({
            isCancelingBooking
        })
        console.log(" - startCancelBooking", isCancelingBooking)
    }

    cancelCancelBooking = () => {
        this.setState({
            isCancelingBooking: null
        })
    }

    confirmCancelBooking = () => {
        console.log("Confirm booking cancellation")


        if (!this.context.token) return

        const cancelEventBookingRequest = {
            query: `
            mutation { cancelBooking (  bookingId: "${this.state.isCancelingBooking._id}" ){ _id, title, description} }

        `}

        var bearer = 'Bearer ' + this.context.token;

        fetch('http://localhost:8000/graphql',
            {
                method: 'POST',
                body: JSON.stringify(cancelEventBookingRequest),
                headers: {
                    'Authorization': bearer,
                    'Content-Type': 'application/json',
                }
            }).then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    console.log(res.json())
                    throw new Error('Failed')

                }
                return res.json()
            })
            .then(resData => {
                if (resData.errors) {
                    console.log("SERVER REPORTED AN ERROR", resData.errors)
                    alert(resData.errors[0].message)
                }
            })
            .catch(err => {
                console.log(err)
            })

        this.setState({
            bookings: this.state.bookings
                .filter(booking => booking._id !== this.state.isCancelingBooking._id)
        })

        this.cancelCancelBooking()

    }


    componentDidMount() {
        this.fetchEventBookings()
    }

    fetchEventBookings() {

        var bearer = 'Bearer ' + this.context.token;

        /*
        type Booking{
            _id: ID!
            event: Event!
            user: User!
            createdAt: String!
            updatedAt: String!
        }
        */

        this.setState({ isLoading: true })
        const request = {
            query: `
            query {
                bookings 
                {
                    _id
                    event { _id, title, date, description, price, date, 
                        creator { _id email} }
                }
              }
              `
        }

        fetch('http://localhost:8000/graphql',
            {
                method: 'POST',
                body: JSON.stringify(request),
                headers: {
                    'Authorization': bearer,
                    'Content-Type': 'application/json',
                }
            }).then(res => {
                this.setState({ isLoading: false })

                if (res.status !== 200 && res.status !== 201) {
                    console.log(res.json())
                    throw new Error('Failed')
                }
                return res.json()
            })
            .then(responseData => {
                this.setState({
                    bookings: responseData.data.bookings
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

    render(props) {
        return (
            <React.Fragment>
                {(this.state.isLoading
                    || this.state.isCancelingBooking) &&
                    <Backdrop />}



                {this.state.isCancelingBooking &&
                    <Modal title={this.state.isCancelingBooking.event.title}
                        canCancel="true"
                        onCancel={this.cancelCancelBooking}
                        canConfirm={true && this.context.token}
                        confirmButtonText="Confirm Booking Cancellation"
                        onConfirm={this.confirmCancelBooking} >

                        <div>{this.state.isCancelingBooking.event.description}</div>


                    </Modal>
                }

                <div className="bookings-control">
                    {this.state.isLoading && <Spinner />}
                    <h1> These are your bookings:</h1>
                    <BookingsList bookings={this.state.bookings} onCancelBooking={this.startCancelBooking} />
                </div>
            </React.Fragment>
        )
    }
}

export default BookingsPage