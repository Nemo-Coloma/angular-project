import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ListResponseModel } from '../models/listResponseModel';
import { Brand } from '../models/brand';
import { ResponseModel } from '../models/responseModel';
import { SingleResponseModel } from '../models/singleResponseModel';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BrandService {
  apiUrl = environment.supabaseUrl + "/rest/v1/brands";

  constructor(private httpClient: HttpClient) { }

  getHeaders() {
    return new HttpHeaders({
      'apikey': environment.supabaseKey,
      'Authorization': 'Bearer ' + environment.supabaseKey,
      'Content-Type': 'application/json'
    });
  }

  getBrands(): Observable<ListResponseModel<Brand>> {
    return this.httpClient.get<any>(this.apiUrl + "?select=*", { headers: this.getHeaders() });
  }

  getById(id: number): Observable<SingleResponseModel<Brand>> {
    return this.httpClient.get<any>(this.apiUrl + "?brandId=eq." + id, { headers: this.getHeaders() });
  }

  addBrand(brand: Brand): Observable<ResponseModel> {
    return this.httpClient.post<any>(this.apiUrl, brand, { headers: this.getHeaders() });
  }

  updateBrand(brand: Brand): Observable<any> {
    return this.httpClient.patch(this.apiUrl + "?brandId=eq." + brand.brandId, brand, { headers: this.getHeaders() });
  }

  deleteBrand(brand: Brand): Observable<any> {
    return this.httpClient.delete(this.apiUrl + "?brandId=eq." + brand.brandId, { headers: this.getHeaders() });
  }
}

