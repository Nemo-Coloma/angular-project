import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { from, Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { LoginModel } from '../models/loginModel';
import { PasswordChangeModel } from '../models/passwordChangeModel';
import { RegisterModel } from '../models/register';
import { ResponseModel } from '../models/responseModel';
import { SingleResponseModel } from '../models/singleResponseModel';
import { TokenModel } from '../models/tokenModel';
import { LocalStorageService } from './local-storage-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  name: string = "";
  surname: string = "";
  userName: string = "";
  role: any;
  roles: any[] = [];
  token: any;
  isLoggedIn: boolean = false;
  userId: any;
  email: string;

  private authUrl = `${environment.supabaseUrl}/auth/v1`;

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private jwtHelper: JwtHelperService,
    private localStorage: LocalStorageService
  ) { }

  private get headers() {
    return new HttpHeaders({
      'apikey': environment.supabaseKey,
      'Content-Type': 'application/json'
    });
  }

  login(loginModel: LoginModel): Observable<SingleResponseModel<TokenModel>> {
    return this.httpClient.post<any>(`${this.authUrl}/token?grant_type=password`, loginModel, { headers: this.headers }).pipe(
      map(response => {
        const tokenModel: TokenModel = {
          token: response.access_token,
          expiration: response.expires_at?.toString() || (Date.now() + response.expires_in * 1000).toString()
        };
        return {
          success: true,
          message: "Login successful",
          data: tokenModel
        } as SingleResponseModel<TokenModel>;
      }),
      catchError(error => {
        const message = error.error?.error_description || error.error?.msg || "Login failed";
        return throwError({ error: message });
      })
    );
  }

  register(registerModel: RegisterModel): Observable<SingleResponseModel<TokenModel>> {
    const body = {
      email: registerModel.email,
      password: registerModel.password,
      data: {
        first_name: registerModel.firstName,
        last_name: registerModel.lastName
      }
    };
    return this.httpClient.post<any>(`${this.authUrl}/signup`, body, { headers: this.headers }).pipe(
      map(response => {
        const tokenModel: TokenModel = {
          token: response.access_token || "",
          expiration: response.expires_at?.toString() || ""
        };
        return {
          success: true,
          message: "Registration successful. Please check your email for verification.",
          data: tokenModel
        } as SingleResponseModel<TokenModel>;
      }),
      catchError(error => {
        const message = error.error?.error_description || error.error?.msg || "Registration failed";
        return throwError({ error: message });
      })
    );
  }

  logout() {
    // Optional: Call Supabase logout REST endpoint if needed
    // For simplicity, just clear local state
    this.localStorage.clear();
    this.onRefresh();
    this.router.navigate(['/login']);
  }

  isAuthenticated() {
    if (this.localStorage.getItem("token")) {
      return true;
    }
    else {
      return false
    }
  }

  userDetailFromToken() {
    this.token = this.localStorage.getItem("token");
    if (!this.token) return;
    const decodedToken = this.jwtHelper.decodeToken(this.token);
    if (!decodedToken) return;

    this.email = decodedToken["email"];

    const metadata = decodedToken["user_metadata"];
    if (metadata) {
      this.name = metadata["first_name"] || "";
      this.surname = metadata["last_name"] || "";
    } else {
      let name = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || "";
      if (name) {
        this.name = name.split(' ')[0];
        this.surname = name.split(' ')[1] || "";
      }
    }

    this.roles = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || [];
    this.role = this.roles;
    this.userId = decodedToken['sub'];
    this.userName = `${this.name} ${this.surname}`;
  }

  roleCheck(roleList: string[]) {
    if (this.roles !== null) {
      return roleList.some(role => this.roles.includes(role));
    } else {
      return false;
    }
  }

  async onRefresh() {
    this.router.routeReuseStrategy.shouldReuseRoute = function () { return false }
    const currentUrl = this.router.url + '?'
    return this.router.navigateByUrl(currentUrl).then(() => {
      this.router.navigated = false
      this.router.navigate([this.router.url])
    })
  }

  changePassword(passwordChangeModel: PasswordChangeModel): Observable<ResponseModel> {
    const headers = this.headers.set('Authorization', `Bearer ${this.localStorage.getItem('token')}`);
    return this.httpClient.put<any>(`${this.authUrl}/user`, { password: passwordChangeModel.newPassword }, { headers }).pipe(
      map(response => {
        return { success: true, message: "Password updated successfully" };
      }),
      catchError(error => {
        const message = error.error?.error_description || error.error?.msg || "Password change failed";
        return throwError({ error: message });
      })
    );
  }

  getCurrentUserId(): any {
    return this.userId
  }

}
