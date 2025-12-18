import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ListResponseModel } from '../models/listResponseModel';
import { Rental } from '../models/rental';
import { ResponseModel } from '../models/responseModel';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RentalService {
  private apiUrl = `${environment.supabaseUrl}/rest/v1`;

  constructor(private httpClient: HttpClient) { }

  private get headers() {
    return new HttpHeaders({
      'apikey': environment.supabaseKey,
      'Authorization': `Bearer ${environment.supabaseKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    });
  }

  getRentals(): Observable<ListResponseModel<Rental>> {
    return this.httpClient.get<any[]>(`${this.apiUrl}/rentals?select=*,cars(name)`, { headers: this.headers }).pipe(
      map(data => {
        const rentals: Rental[] = data.map(item => ({
          rentalId: item.id,
          carId: item.car_id,
          rentDate: item.rent_date,
          returnDate: item.return_date,
          totalRentPrice: item.total_price
        }));
        return { success: true, message: "Rentals listed successfully", data: rentals };
      })
    );
  }

  addRental(rental: Rental): Observable<any> {
    const body = {
      car_id: rental.carId,
      rent_date: rental.rentDate,
      return_date: rental.returnDate,
      total_price: rental.totalRentPrice
    };
    return this.httpClient.post(`${this.apiUrl}/rentals`, body, { headers: this.headers });
  }

  updateRental(rental: Rental): Observable<any> {
    const body = {
      rent_date: rental.rentDate,
      return_date: rental.returnDate,
      total_price: rental.totalRentPrice
    };
    return this.httpClient.patch(`${this.apiUrl}/rentals?id=eq.${rental.rentalId}`, body, { headers: this.headers });
  }

  deleteRental(rentalId: number): Observable<any> {
    return this.httpClient.delete(`${this.apiUrl}/rentals?id=eq.${rentalId}`, { headers: this.headers });
  }

  isRentable(rental: Rental): Observable<ResponseModel> {
    // Basic check: if returnDate is null, it might be busy. 
    // For now, return success to simulate compatibility.
    return of({ success: true, message: "Car is available" });
  }
}
