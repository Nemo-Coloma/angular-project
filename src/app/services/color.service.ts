
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Color } from '../models/color';
import { ListResponseModel } from '../models/listResponseModel';
import { ResponseModel } from '../models/responseModel';
import { SingleResponseModel } from '../models/singleResponseModel';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ColorService {
  apiUrl = environment.supabaseUrl + "/rest/v1/colors";

  constructor(private httpClient: HttpClient) { }

  getHeaders() {
    return new HttpHeaders({
      'apikey': environment.supabaseKey,
      'Authorization': 'Bearer ' + environment.supabaseKey,
      'Content-Type': 'application/json'
    });
  }

  getColors(): Observable<ListResponseModel<Color>> {
    return this.httpClient.get<any>(this.apiUrl + "?select=*", { headers: this.getHeaders() });
  }

  getById(id: number): Observable<SingleResponseModel<Color>> {
    return this.httpClient.get<any>(this.apiUrl + "?colorId=eq." + id, { headers: this.getHeaders() });
  }

  addColor(color: Color): Observable<ResponseModel> {
    return this.httpClient.post<any>(this.apiUrl, color, { headers: this.getHeaders() });
  }

  updateColor(color: Color): Observable<any> {
    return this.httpClient.patch(this.apiUrl + "?colorId=eq." + color.colorId, color, { headers: this.getHeaders() });
  }

  deleteColor(color: Color): Observable<any> {
    return this.httpClient.delete(this.apiUrl + "?colorId=eq." + color.colorId, { headers: this.getHeaders() });
  }
}
