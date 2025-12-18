import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { LocalStorageService } from 'src/app/services/local-storage-service.service';

@Component({
  selector: 'app-navi',
  templateUrl: './navi.component.html',
  styleUrls: ['./navi.component.css']
})
export class NaviComponent implements OnInit {
  get lastName() { return this.authService.surname; }
  get firstName() { return this.authService.name; }
  get userRol() {
    if (Array.isArray(this.authService.role)) {
      return this.authService.role[0];
    }
    return this.authService.role;
  }
  constructor(
    private authService: AuthService,
    private toasterService: ToastrService,
    private localStorageService: LocalStorageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (this.isAuthenticated()) {
      this.authService.userDetailFromToken();

    }
  }

  isAuthenticated() {
    if (this.authService.isAuthenticated()) {
      return true


    }
    else {
      return false
    }
  }
  checkAdminRole() {


    if (this.authService.role[0] == "admin") {
      return true
    }
    else {
      return false

    }
  }

  checkUserRole() {
    if (this.authService.role == "user") {
      return true
    }
    else {
      return false
    }
  }

  checkNotRole() {
    if (this.authService.role == null) {
      return true
    }
    else {
      return false
    }
  }

  logout() {
    this.authService.logout()
    this.toasterService.success("Logged out successfully", "Success")
  }

}
