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
  private apiUrl = `${environment.supabaseUrl}/rest/v1`;

  constructor(private httpClient: HttpClient) { }

  private get headers() {
    return new HttpHeaders({
      'apikey': environment.supabaseKey,
      'Authorization': `Bearer ${environment.supabaseKey}`,
      'Content-Type': 'application/json'
    });
  }

  getCustomer(): Observable<ListResponseModel<Customer>> {
    return this.httpClient.get<any[]>(`${this.apiUrl}/customers?select=*,users(first_name,last_name)`, { headers: this.headers }).pipe(
      map(data => {
        const customers: any[] = data.map(item => ({
          userId: item.user_id,
          companyName: item.company_name,
          firstName: item.users?.first_name,
          lastName: item.users?.last_name
        }));
        return { success: true, message: "Customers listed successfully", data: customers };
      })
    );
  }
}
