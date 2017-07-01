import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormGroup, FormControl, FormBuilder, Validators} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {BookingService} from '../services/booking.service';
import {SharedDataService} from '../services/shared.data.service';
import {BookingDto} from '../models';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-search-flight',
  templateUrl: './search-flight.component.html',
  styleUrls: ['../app.component.css']
})
export class SearchFlightComponent implements OnInit {

    public searchForm: FormGroup;
    public flightForm: FormGroup;

    constructor(private _fb: FormBuilder, private sdService: SharedDataService, private bookingService: BookingService, private router: Router, private datepipe: DatePipe) { }

    ngOnInit() {
        this.searchForm = this._fb.group({
            departure: ['YYZ', [Validators.required]],
            arrival: ['JFK', [Validators.required]],
            departureDate: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
            returnDate: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]]
        });

        this.flightForm = this._fb.group({
            flightid: ['', [Validators.required]],
            departure: ['', [Validators.required]],
            arrival: ['', [Validators.required]],
            departureDate: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
            returnDate: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]]
        });

        this.searchForm.valueChanges.subscribe(data => this.onValueChanged(data));
        this.onValueChanged(); // (re)set validation messages

        //setting default values for initial loading
        let bookingReq = new BookingDto();
        bookingReq.departure = "YYZ";
        bookingReq.arrival = "JFK";
        bookingReq.departureDate = this.datepipe.transform(new Date(), 'yyyy-MM-dd');//current date;
        bookingReq.returnDate = this.datepipe.transform(new Date((new Date()).getTime() + (60*60*24*10000)), 'yyyy-MM-dd');//current date + 10 days;

        this.searchFlights(bookingReq);
   
    }

    departure = "";
    arrival = "";
    departureDate = "";
    returnDate = "";
    airportList = [];
    flightList = [];
    errorMessage: string = "";

    submitFlights(value){
        console.log(value);
        let bookingReq = new BookingDto();
        value.departure ? bookingReq.departure = value.departure : bookingReq.departure = "YYZ";
        value.arrival ? bookingReq.arrival = value.arrival : bookingReq.arrival = "JFK";

        value.departureDate ?  bookingReq.departureDate = value.departureDate : bookingReq.departureDate = this.departureDate;

        value.returnDate ? bookingReq.returnDate = value.returnDate : bookingReq.returnDate = this.returnDate;

        this.searchFlights(bookingReq);
    }

    flightids = [];//selected ids
    confirmFlights(value){  
        //console.log(this.flightids);

        let confirmList = [];
        this.flightids.forEach(id => {
          if(id[0])
            confirmList.push(this.flightList.find(x => x.id === id[1]));
        });
        //console.log(confirmList);

        if(confirmList.length === 0){
          this.formErrors['checkFlight'] = this.validationMessages['checkFlight']['required'] + ' ';
          return;
        }

        this.sdService.setFlights4Booking(confirmList);
        this.router.navigateByUrl('/confirmBooking');
    }

    searchFlights(bookingReq:BookingDto) {

        this.bookingService.searchFlights(bookingReq)
                          .subscribe( bookingRes => {this.departure = bookingRes.departure;
                                                      this.arrival = bookingRes.arrival;
                                                      this.departureDate = bookingRes.departureDate;
                                                      this.returnDate = bookingRes.returnDate;
                                                      this.airportList = bookingRes.airportList;
                                                      this.flightList = bookingRes.flightList;},
                                      error =>  this.errorMessage = <any>error); 
        //console.log(this.airportList);
        //console.log(this.flightList);
    }

    /** Validation start */
      onValueChanged(data?: any) {
        if (!this.searchForm) { return; }
        const form = this.searchForm;

        for (const field in this.formErrors) {
          // clear previous error message (if any)
          this.formErrors[field] = '';
          const control = form.get(field);

          if (control && control.dirty && !control.valid) {
            const messages = this.validationMessages[field];
            for (const key in control.errors) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }

      formErrors = {
        'departureDate': '',
        'returnDate': '',
        'checkFlight': ''
      };

      validationMessages = {
        'departureDate': {
              'required':      'DepartureDate is required.',
              'minlength':     'DepartureDate must be yyyy-MM-dd format.',
              'maxlength':     'DepartureDate must be yyyy-MM-dd format.'
        },
        'returnDate': {
              'required':      'ReturnDate is required.',
              'minlength':     'ReturnDate must be yyyy-MM-dd format.',
              'maxlength':     'ReturnDate must be yyyy-MM-dd format.'  
        },
        'checkFlight': {
              'required':      'Please select a flight on the list.',
        }
      };

}
