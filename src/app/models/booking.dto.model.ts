import {Airport} from './airport.model';
import {Booking} from './booking.model';
import {Flight} from './flight.model';

export class BookingDto {
   departure: string; //airport code
   arrival: string; //airport code
   departureDate: string;
   returnDate: string;
   booker: string; //booker id (email)
   password: string; 
   flightIds: Array<string> // flight id for booking
   airportList: Array<Airport> 
   flightList: Array<Flight> 
   bookingList: Array<Booking> 
   constructor() {}

} 
