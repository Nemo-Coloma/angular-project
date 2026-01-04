import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CarImage } from '../models/carImage';
import { ListResponseModel } from '../models/listResponseModel';
import { ResponseModel } from '../models/responseModel';

@Injectable({
  providedIn: 'root'
})
export class CarImageService {

  apiUrl = 'https://localhost:44388/api/';

  constructor(private httpClient: HttpClient) { }

  getCarImages(carId: number): Observable<ListResponseModel<CarImage>> {
    return this.httpClient.get<ListResponseModel<CarImage>>(this.apiUrl + 'carImages/getimagesbycarid?carId=' + carId).pipe(
      catchError(err => {
        return of({ success: true, message: "API unavailable, using empty image list", data: [] });
      })
    );
  }

  deleteImages(carImage: CarImage): Observable<ResponseModel> {
    return this.httpClient.post<ResponseModel>(this.apiUrl + 'carImages/delete', carImage);
  }
}


