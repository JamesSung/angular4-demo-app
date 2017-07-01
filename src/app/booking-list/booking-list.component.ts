import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, FormBuilder, Validators} from '@angular/forms';
import {BookingService} from '../services/booking.service';
import {SharedDataService} from '../services/shared.data.service';
import {BookingDto} from '../models';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-booking-list',
  templateUrl: './booking-list.component.html',
  styleUrls: ['../app.component.css']
})
export class BookingListComponent implements OnInit {
  bookingForm: FormGroup; 

  constructor(private _fb: FormBuilder, private sdService: SharedDataService, private bookingService: BookingService) { }

  ngOnInit() {
    this.booker = this.sdService.getBooker();
    this.password = this.sdService.getPassword();

    //this doesn't work well, because we call server asynchronously, we are here before data has arrived
    //this.bookingList = this.sdService.findBooking(this.booker, this.password);
    let bookingReq = new BookingDto();
    bookingReq.booker = this.booker;
    bookingReq.password = this.password;
    this.bookingService.getBookingList(bookingReq)
                       .subscribe( bookingRes => {this.bookingList = bookingRes.bookingList;},
                                   error =>  this.errorMessage = <any>error); 

    //console.log("booker: " + this.booker + ", password: " + this.password);
    //console.log(this.bookingList);

    //build Form
    this.bookingForm = this._fb.group({
        booker: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(30)]],//, forbiddenValueValidator(/bob/i)]
        password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(10)]]
    });

    this.bookingForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged(); // (re)set validation messages
  }

  booker: string = "";
  password: string = "";
  bookingList = [];
  errorMessage: string = "";

  searchBookings(value) { 
      //console.log(value);
      let bookingReq = new BookingDto();
      bookingReq.booker = value.booker;
      bookingReq.password = value.password;

      this.bookingService.getBookingList(bookingReq)
                         .subscribe( bookingRes => {this.booker = bookingRes.booker;
                                                    this.password = bookingRes.password;
                                                    this.bookingList = bookingRes.bookingList;},
                                     error =>  this.errorMessage = <any>error); 
      //console.log(this.bookingList);
  }

  /** Validation start */
  onValueChanged(data?: any) {
    if (!this.bookingForm) { return; }
    const form = this.bookingForm;

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
