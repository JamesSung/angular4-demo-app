import {Injectable} from '@angular/core';
import {Airport, Booking, Flight, BookingDto} from '../models';

@Injectable()
export class SharedDataService {

    private booker : string;
    private password : string;
    private flights4Booking : Array<Flight> ;
    private bookings : Array<Booking> ;
    private bookedMap = new Map();

    public setBooker(booker:string){
        this.booker = booker;
    }

    public getBooker(){
        return this.booker;
    }

    public setPassword(password:string){
        this.password = password;
    }

    public getPassword(){
        return this.password;
    }

    public setFlights4Booking(flights4Booking : Array<Flight> ){
        this.flights4Booking = flights4Booking;
    }

    public getFlight4Booking(){
        return this.flights4Booking;
    }

    public setBookings(bookings : Array<Booking> ){
        this.bookings = bookings;
    }

    public getBookings(){
        return this.bookings;
    }

    public addBookingByBooker(id:string, pwd:string, val:Array<Booking>){
        if(val == null) return;

        let curr: Array<Booking> = this.findBooking(id,pwd);
        if(curr != null){
            val.forEach(b => curr.push(b));
        }else
            this.bookedMap.set(id+pwd,val);

        //console.log( this.bookedMap.get(id+pwd));
    }

    public addBooking(booking :BookingDto){
        //console.log(booking.bookingList);
        this.addBookingByBooker(booking.booker, booking.password, booking.bookingList);
    }    

    public findBooking(id:string, pwd:string){
        return this.bookedMap.get(id+pwd);
    }
}