import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Car } from 'src/app/models/car';
import { Rental } from 'src/app/models/rental';
import { CarService } from 'src/app/services/car.service';
import { RentalService } from 'src/app/services/rental.service';

@Component({
  selector: 'app-rental',
  templateUrl: './rental.component.html',
  styleUrls: ['./rental.component.css']
})
export class RentalComponent implements OnInit {
  car: Car;
  startDate: Date;
  endDate: Date;
  rentPrice: number = 0;
  rental: Rental;
  rentable: Boolean = true;
  constructor(
    private rentalService: RentalService,
    private carService: CarService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastrService: ToastrService
  ) { }
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      if (params["carId"]) {
        this.getCarDetail(params["carId"])
      }
    })
  }

  getCarDetail(carId: number) {
    this.carService.getCarDetail(carId).subscribe((response) => {
      this.car = response.data[0];
    });
  }

  addRental(rental: Rental) {

    if (this.rentable === true) {
      this.rental = this.rental;

      this.router.navigate(['/creditcard/', JSON.stringify(this.rental)]);
      this.toastrService.info("Redirecting to credit card payment page", "Redirecting")
    } else {
      this.toastrService.error("You cannot rent the car between these dates", "Already rented")
      console.log("You cannot rent the car between these dates", "Already rented")
    }
  }

  setRentable() {
    this.rentalService.isRentable(this.rental).subscribe(response => {
      this.rentable = response.success
    })
  }

  calculatePrice() {
    if (this.startDate && this.endDate) {
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);

      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

      if (diffDays > 0) {
        let result = diffDays * this.car.dailyPrice;
        this.rental = { carId: this.car.carId, rentDate: this.startDate, returnDate: this.endDate, totalRentPrice: result };
        this.rentPrice = result;
        this.setRentable();
      } else {
        this.rentPrice = 0;
        this.toastrService.info("End date must be after start date", "!");
      }
    } else {
      this.rentPrice = 0;
    }
  }
}
