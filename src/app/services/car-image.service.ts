import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CarImage } from '../models/carImage';
import { ListResponseModel } from '../models/listResponseModel';
import { ResponseModel } from '../models/responseModel';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CarImageService {
  apiUrl = environment.supabaseUrl + "/rest/v1/carImages";

  constructor(private httpClient: HttpClient) { }

  getHeaders() {
    return new HttpHeaders({
      'apikey': environment.supabaseKey,
      'Authorization': 'Bearer ' + environment.supabaseKey,
      'Content-Type': 'application/json'
    });
  }

  getCarImages(carId: number): Observable<ListResponseModel<CarImage>> {
    return this.httpClient.get<any>(this.apiUrl + "?carId=eq." + carId, { headers: this.getHeaders() }).pipe(
      catchError(err => {
        return of({ success: true, message: "No images", data: [] });
      })
    );
  }

  deleteImages(carImage: CarImage): Observable<any> {
    return this.httpClient.delete(this.apiUrl + "?imageId=eq." + carImage.imageId, { headers: this.getHeaders() });
  }
}


