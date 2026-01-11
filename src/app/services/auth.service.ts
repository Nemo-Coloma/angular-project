import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, throwError } from 'rxjs';
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
  email: string = "";

  private authUrl = `${environment.supabaseUrl}/auth/v1`;

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private jwtHelper: JwtHelperService,
    private localStorage: LocalStorageService
  ) { }

  getHeaders() {
    return new HttpHeaders({
      'apikey': environment.supabaseKey,
      'Content-Type': 'application/json'
    });
  }

  login(loginModel: LoginModel): Observable<SingleResponseModel<TokenModel>> {
    return this.httpClient.post<any>(`${this.authUrl}/token?grant_type=password`, loginModel, { headers: this.getHeaders() }).pipe(
      map(response => {
        const tokenModel: TokenModel = {
          token: response.access_token,
          expiration: response.expires_at?.toString() || ""
        };
        return {
          success: true,
          message: "Login success",
          data: tokenModel
        };
      }),
      catchError(error => {
        return throwError({ error: "Login failed" });
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
    return this.httpClient.post<any>(`${this.authUrl}/signup`, body, { headers: this.getHeaders() }).pipe(
      map(response => {
        const tokenModel: TokenModel = {
          token: response.access_token || "",
          expiration: response.expires_at?.toString() || ""
        };
        return {
          success: true,
          message: "Register success",
          data: tokenModel
        };
      }),
      catchError(error => {
        return throwError({ error: "Register failed" });
      })
    );
  }

  logout() {
    this.localStorage.clear();
    this.name = "";
    this.surname = "";
    this.userName = "";
    this.roles = [];
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }

  isAuthenticated() {
    if (this.localStorage.getItem("token")) {
      return true;
    } else {
      return false;
    }
  }

  userDetailFromToken() {
    this.token = this.localStorage.getItem("token");
    if (this.token) {
      const decodedToken = this.jwtHelper.decodeToken(this.token);
      if (decodedToken) {
        this.email = decodedToken["email"];
        const metadata = decodedToken["user_metadata"];
        if (metadata) {
          this.name = metadata["first_name"] || "";
          this.surname = metadata["last_name"] || "";
        }
        this.roles = decodedToken['role'] || [];
        this.userId = decodedToken['sub'];
        this.userName = this.name + " " + this.surname;
        this.isLoggedIn = true;
      }
    }
  }

  roleCheck(roleList: string[]) {
    if (this.roles) {
      return roleList.some(role => this.roles.includes(role));
    }
    return false;
  }

  changePassword(passwordChangeModel: PasswordChangeModel): Observable<ResponseModel> {
    const headers = this.getHeaders().set('Authorization', `Bearer ${this.localStorage.getItem('token')}`);
    return this.httpClient.put<any>(`${this.authUrl}/user`, { password: passwordChangeModel.newPassword }, { headers }).pipe(
      map(response => {
        return { success: true, message: "Password updated" };
      }),
      catchError(error => {
        return throwError({ error: "Password change failed" });
      })
    );
  }

  onRefresh() {
    window.location.reload();
  }

  getCurrentUserId() {
    return this.userId;
  }
}
