import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {FormGroup, FormControl, FormBuilder, Validators} from '@angular/forms';
import {BookingService} from '../services/booking.service';
import {SharedDataService} from '../services/shared.data.service';
import {Flight, BookingDto} from '../models';
import {BookingListComponent} from '../booking-list/booking-list.component';

@Component({
  selector: 'app-confirm-booking',
  templateUrl: './confirm-booking.component.html',
  styleUrls: ['../app.component.css']
})
export class ConfirmBookingComponent implements OnInit {
  flightForm: FormGroup; 
  flightList: Array<Flight> = [];

  constructor(private _fb: FormBuilder, private location: Location, private sdService: SharedDataService,private bookingService: BookingService, private router: Router) { }

  ngOnInit() {
    this.flightList = this.sdService.getFlight4Booking();
    console.log(this.flightList);
    this.flightForm = this._fb.group({
        booker: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(30)]],
        password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(10)]]
    });

    this.flightForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged(); // (re)set validation messages
  }

  booker = "";
  password = "";
  bookingList = [];
  errorMessage: string = "";

  confirmBooking(value) {
      //console.log(value);
      let bookingReq = new BookingDto();
      bookingReq.booker = value.booker;
      bookingReq.password = value.password;
      bookingReq.flightList = this.flightList;

      bookingReq.flightIds = [];
      this.flightList.forEach(flight => {
        //console.log(flight.id);
        bookingReq.flightIds.push(flight.id); 
      });

      this.bookingService.addBooking(bookingReq)
                         .subscribe( bookingRes => {this.sdService.addBooking(bookingRes);},
                                     error =>  this.errorMessage = <any>error); 
      //console.log(this.sdService.findBooking(value.booker, value.password));
      
      this.sdService.setBooker(value.booker);
      this.sdService.setPassword(value.password);

      this.location.replaceState('/'); //clears browser history
      this.router.navigate(['bookingList']);
  }

  back() {
    this.location.back();
  }

  /** Validation start */
  onValueChanged(data?: any) {
    if (!this.flightForm) { return; }
    const form = this.flightForm;

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
    'booker': '',
    'password': ''
  };

  validationMessages = {
    'booker': {
        'required':      'Email is required.',
        'minlength':     'Email must be at least 5 characters long.',
        'maxlength':     'Email cannot be more than 30 characters long.',
        'email': 'Not valid email address.'
    },
    'password': {
        'required': 'Password is required.',
        'minlength':'Password must be at least 4 characters long.',
        'maxlength':'Password cannot be more than 10 characters long.'      
    }
  };
  /** Validation end */
}
