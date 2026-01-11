import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SupabaseService {
    constructor(private http: HttpClient) { }

    getHeaders() {
        return new HttpHeaders({
            'apikey': environment.supabaseKey,
            'Authorization': `Bearer ${environment.supabaseKey}`,
            'Content-Type': 'application/json'
        });
    }

    getBrands(): Observable<any[]> {
        return this.http.get<any[]>(`${environment.supabaseUrl}/rest/v1/brands?select=*`, {
            headers: this.getHeaders()
        });
    }
}
