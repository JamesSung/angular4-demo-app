import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Flight, Airport, Booking, BookingDto} from '../models';
import {Observable} from 'rxjs';
import {DatePipe} from '@angular/common';
import {SharedDataService} from './shared.data.service';
import 'rxjs/add/operator/map';
//import 'rxjs/add/operator/toPromise';

@Injectable()
export class BookingService {

    constructor(private http:Http, private sdService: SharedDataService,private datepipe: DatePipe){}
    
    private server = "http://localhost:8081";
    private search_flight_url = this.server + "/searchFlight";
    private confirm_booking_url = this.server + "/confirmBooking";
    private booking_list_url = this.server + "/bookingList";
    private add_booking_url = this.server + "/addBooking";

    private headers = new Headers({'Content-Type': 'application/json'});
    private options = new RequestOptions({ headers: this.headers });

    //use for local test
    private isLocalTest: Boolean = true;

    public searchFlights(booking: BookingDto): Observable<BookingDto>{

	    if(this.isLocalTest){
            return this.http.get("assets/data/booking.json")
                        .map(res => this.extractDataSearch(res, booking))
                        .catch(this.handleError);
        }

        return this.http.post(this.search_flight_url, booking, this.options)
                        .map(this.extractData)
                        .catch(this.handleError);
    }

    public confirmBooking(booking: BookingDto): Observable<BookingDto>{

         return this.http.post(this.confirm_booking_url, booking, this.options)
	                    .map(this.extractData)
                        .catch(this.handleError);
    }

    public getBookingList(booking: BookingDto): Observable<BookingDto>{
        if(this.isLocalTest) {
            booking.bookingList = this.sdService.findBooking(booking.booker, booking.password);
            //console.log(booking.bookingList);
            return Observable.of(booking);
        }else
            return this.http.post(this.booking_list_url, booking, this.options)
                            .map(this.extractData)
                            .catch(this.handleError);
    }

    public addBooking(booking: BookingDto): Observable<BookingDto>{

        if(this.isLocalTest) {
            
            let bk = new Booking();
            bk.bookDate = this.datepipe.transform(new Date(), 'yyyy-MM-dd');//current date;
            bk.booker = booking.booker;
            bk.password = booking.password;
            bk.flights = booking.flightList;
            let bookingList = [];
            bookingList.push(bk);

            booking.bookingList = bookingList;

            //return new Promise(() => { return booking;});
            return Observable.of(booking);
        }

          return this.http.post(this.add_booking_url, booking, this.options)
                        //.toPromise()
                        //.then(res => res.json() as BookingDto)
                        .map(this.extractData)
                        .catch(this.handleError);
                        
    }

    private extractData(res: Response) {
        //console.log(res);
	    let body = res.json();
        //console.log(body);
        return body || {};
    }

    private extractDataSearch(res: Response, booking: BookingDto) {

	    let body = res.json();
        console.log(booking);
        //console.log(body);

        booking.airportList = body['airportList'];
        let flights:Array<Flight> = body['flightList']
        let flltered = [];
        flights.forEach(elm => {
            //console.log("dep:"+elm.departureDate + ", input dep: " + booking.departureDate + ", rtn: " + booking.returnDate);
            if(elm.departureDate >= booking.departureDate && elm.departureDate <= booking.returnDate){
                if( booking.departure != booking.arrival
                    && (booking.departure == elm.departure.code || booking.departure == elm.arrival.code)
                    && (booking.arrival == elm.departure.code || booking.arrival == elm.arrival.code))
                        flltered.push(elm);
            }
        });

        booking.flightList = flltered;

        console.log(booking);
      
        return booking;
    }

    private handleError (error: Response | any) {
	    //console.error(error.message || error);
	    return Observable.throw(error.message || error);
    }
 
  private handleErrorPromise(error: any): Promise<any> {
    //console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

}