import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ListResponseModel } from '../models/listResponseModel';
import { Rental } from '../models/rental';
import { ResponseModel } from '../models/responseModel';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RentalService {
  apiUrl = environment.supabaseUrl + "/rest/v1/rentals";

  constructor(private httpClient: HttpClient) { }

  getHeaders() {
    return new HttpHeaders({
      'apikey': environment.supabaseKey,
      'Authorization': 'Bearer ' + environment.supabaseKey,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    });
  }

  getRentals(): Observable<ListResponseModel<Rental>> {
    return this.httpClient.get<any[]>(this.apiUrl + "?select=*", { headers: this.getHeaders() }).pipe(
      map(data => {
        let rentals = data.map(item => {
          return {
            rentalId: item.id,
            carId: item.car_id,
            customerId: item.customer_id,
            rentDate: item.rent_date,
            returnDate: item.return_date,
            totalRentPrice: item.total_price,
            carName: "Car " + item.car_id,
            customerName: "Customer " + item.customer_id
          };
        });
        return { success: true, message: "Success", data: rentals };
      })
    );
  }

  addRental(rental: Rental): Observable<any> {
    let body = {
      car_id: rental.carId,
      customer_id: rental.customerId,
      rent_date: rental.rentDate,
      return_date: rental.returnDate,
      total_price: rental.totalRentPrice
    };
    return this.httpClient.post(this.apiUrl, body, { headers: this.getHeaders() });
  }

  updateRental(rental: Rental): Observable<any> {
    let body = {
      customer_id: rental.customerId,
      rent_date: rental.rentDate,
      return_date: rental.returnDate,
      total_price: rental.totalRentPrice
    };
    return this.httpClient.patch(this.apiUrl + "?id=eq." + rental.rentalId, body, { headers: this.getHeaders() });
  }

  deleteRental(rentalId: number): Observable<any> {
    return this.httpClient.delete(this.apiUrl + "?id=eq." + rentalId, { headers: this.getHeaders() });
  }

  isRentable(rental: Rental): Observable<ResponseModel> {
    return of({ success: true, message: "Car is available" });
  }
}
