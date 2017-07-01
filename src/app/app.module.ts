import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AppComponent } from './app.component';
import { ConfirmBookingComponent } from './confirm-booking/confirm-booking.component';
import { BookingListComponent } from './booking-list/booking-list.component';
import { SearchFlightComponent } from './search-flight/search-flight.component';
import { BookingService } from './services/booking.service';
import { SharedDataService } from './services/shared.data.service';

@NgModule({
  declarations: [
    AppComponent,
    ConfirmBookingComponent,
    BookingListComponent,
    SearchFlightComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule.forRoot([
      { path: '', component: SearchFlightComponent },
      { path: 'searchFlight', component: SearchFlightComponent},
      { path: 'confirmBooking', component: ConfirmBookingComponent},
      { path: 'bookingList', component: BookingListComponent}
    ])
  ],
  providers: [BookingService, SharedDataService, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
