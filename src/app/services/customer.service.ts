import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ListResponseModel } from '../models/listResponseModel';
import { Customer } from '../models/customer';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  apiUrl = environment.supabaseUrl + "/rest/v1/customers";

  constructor(private httpClient: HttpClient) { }

  getHeaders() {
    return new HttpHeaders({
      'apikey': environment.supabaseKey,
      'Authorization': 'Bearer ' + environment.supabaseKey,
      'Content-Type': 'application/json'
    });
  }

  getCustomer(): Observable<ListResponseModel<Customer>> {
    return this.httpClient.get<any[]>(this.apiUrl + "?select=*", { headers: this.getHeaders() }).pipe(
      map(data => {
        let customers = data.map(item => {
          return {
            userId: item.user_id,
            companyName: item.company_name,
            firstName: "Customer",
            lastName: item.id
          };
        });
        return { success: true, message: "Success", data: customers };
      })
    );
  }
}
