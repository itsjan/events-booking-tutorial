import React, { Component } from 'react'
import Backdrop from '../Backdrop/Backdrop'
import Spinner from '../Spinner/Spinner'
import AuthContext from '../../context/auth-context'
import BookingsList from './BookingsList/BookingsList'
import './BookingsPage.css'


class BookingsPage extends Component {

    static contextType = AuthContext


    constructor(props) {
        super(props)
        this.state = {
            bookings: [],
            isLoading: false,
        }
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

                /*
                        method: 'POST',
        
                        body: JSON.stringify(request),
                        headers: {
                            'Content-Type': 'application/json',
                        }
                */
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
                {this.state.isLoading &&
                    <Backdrop />}

                <div className="bookings-control">
                    
                    {this.state.isLoading && <Spinner />}
                    <h1> These are your bookings:</h1>
                    <BookingsList bookings={this.state.bookings} />



                </div>
            </React.Fragment>
        )
    }
}

export default BookingsPage