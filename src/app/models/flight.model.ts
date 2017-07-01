import {Airport} from './airport.model';

export class Flight {
   id: string; //flight key
   planeName: string; 
   company: string;
   departureCode: string; // departure airport code
   arrivalCode: string; //arrival airport code
   departureDate: string; 
   price: number;
   departure: Airport;
   arrival: Airport;

   constructor() {}
} 