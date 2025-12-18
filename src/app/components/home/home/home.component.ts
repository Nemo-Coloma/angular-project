import { Component, OnInit } from '@angular/core';
import { Car } from 'src/app/models/car';
import { CarImage } from 'src/app/models/carImage';
import { CarService } from 'src/app/services/car.service';
import { RentalService } from 'src/app/services/rental.service';
import { Rental } from 'src/app/models/rental';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  cars: Car[] = [];
  dataLoaded: boolean = false;

  // Rental Modal State
  selectedCar: Car | null = null;
  rental: Rental = { carId: 0, rentDate: new Date() };
  rentals: Rental[] = [];
  isModalOpen = false;
  isEditing = false;

  constructor(
    private carService: CarService,
    private rentalService: RentalService,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.getCars()
  }

  getCars() {
    this.carService.getCars().subscribe(response => {
      this.cars = response.data.slice(0, 6);
      this.dataLoaded = true;
    })
  }

  // Rental Modal Methods
  openRentModal(car: Car) {
    this.selectedCar = car;
    this.rental = {
      carId: car.carId,
      rentDate: new Date(),
      returnDate: undefined,
      totalRentPrice: car.dailyPrice
    };
    this.isEditing = false;
    this.isModalOpen = true;
    this.loadRentals(car.carId);
  }

  loadRentals(carId: number) {
    this.rentalService.getRentals().subscribe(res => {
      this.rentals = res.data.filter(r => r.carId === carId);
    });
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedCar = null;
    this.rentals = [];
    this.isEditing = false;
  }

  editRental(rental: Rental) {
    this.rental = { ...rental };
    this.isEditing = true;
  }

  saveRental() {
    if (!this.rental.rentDate || !this.rental.returnDate) {
      this.toastrService.warning("Please select both dates");
      return;
    }

    if (this.isEditing) {
      this.rentalService.updateRental(this.rental).subscribe(res => {
        this.toastrService.success("Rental updated successfully");
        this.loadRentals(this.selectedCar!.carId);
        this.isEditing = false;
        this.rental = { carId: this.selectedCar!.carId, rentDate: new Date() };
      });
    } else {
      this.rentalService.addRental(this.rental).subscribe(res => {
        this.toastrService.success("Car rented successfully!");
        this.loadRentals(this.selectedCar!.carId);
      }, err => {
        this.toastrService.error("Could not complete rental");
      });
    }
  }

  deleteRental(rentalId: number) {
    if (confirm("Are you sure you want to cancel this rental?")) {
      this.rentalService.deleteRental(rentalId).subscribe(res => {
        this.toastrService.info("Rental cancelled");
        this.loadRentals(this.selectedCar!.carId);
      });
    }
  }

  getCurrentImageClass(car: Car) {
    if (car == this.cars[0]) {
      return "carousel-item active"
    } else {
      return "carousel-item"
    }
  }

  getButtonClass(car: Car) {
    if (car == this.cars[0]) {
      return "active"
    } else {
      return ""
    }
  }
}
