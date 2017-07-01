import {Flight} from './flight.model';

export class Booking {
    id: string; //booking key
    bookDate: string;
    numOfTickets: number;
    booker: string; //booker id (email)
    password: string; 
    status: string; 
    flights: Array<Flight> // flight list
    constructor() {}
} 

  