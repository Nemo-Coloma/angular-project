import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Car } from 'src/app/models/car';
import { CarService } from 'src/app/services/car.service';
import { RentalService } from 'src/app/services/rental.service';
import { CustomerService } from 'src/app/services/customer.service';
import { Rental } from 'src/app/models/rental';
import { Customer } from 'src/app/models/customer';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.css']
})
export class CarComponent implements OnInit {
  cars: Car[] = [];
  customers: Customer[] = [];
  dataLoaded: boolean = false;
  carFilter: string = "";

  selectedCar: Car | null = null;
  rental: Rental = { carId: 0, rentDate: new Date() };
  rentals: Rental[] = [];
  isModalOpen = false;
  isEditing = false;

  constructor(
    private carService: CarService,
    private rentalService: RentalService,
    private customerService: CustomerService,
    private activatedRoute: ActivatedRoute,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      if (params["brandId"] && params["colorId"]) {
        this.getCarsBySelect(params["brandId"], params["colorId"])
      } else if (params["colorId"]) {
        this.getCarsByColor(params["colorId"]);
      } else if (params["brandId"]) {
        this.getCarsByBrand(params["brandId"])
      } else {
        this.getCars()
      }
    });
    this.getCustomers();
  }

  getCustomers() {
    this.customerService.getCustomer().subscribe(res => {
      this.customers = res.data;
    });
  }

  getCars() {
    this.carService.getCars().subscribe(res => {
      this.cars = res.data;
      this.dataLoaded = true;
    })
  }

  getCarsByBrand(brandId: number) {
    this.carService.getCarsByBrand(brandId).subscribe(res => {
      this.cars = res.data;
      this.dataLoaded = true;
    })
  }

  getCarsByColor(colorId: number) {
    this.carService.getCarsByColor(colorId).subscribe(res => {
      this.cars = res.data;
      this.dataLoaded = true;
    })
  }

  getCarsBySelect(brandId: number, colorId: number) {
    this.carService.getCarsBySelect(brandId, colorId).subscribe(res => {
      this.cars = res.data
      this.dataLoaded = true;
    })
  }

  openRentModal(car: Car) {
    this.selectedCar = car;
    let today = new Date().toISOString().split('T')[0];
    this.rental = {
      carId: car.carId,
      customerId: this.customers[0]?.userId?.toString() || '',
      rentDate: today as any,
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

  calculateTotalPrice(): number {
    if (this.rental.rentDate && this.rental.returnDate && this.selectedCar) {
      let date1 = new Date(this.rental.rentDate);
      let date2 = new Date(this.rental.returnDate);
      let diffTime = date2.getTime() - date1.getTime();
      let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      if (diffDays > 0) {
        return diffDays * this.selectedCar.dailyPrice;
      }
      return 0;
    }
    return this.selectedCar?.dailyPrice || 0;
  }

  saveRental() {
    if (!this.rental.rentDate || !this.rental.returnDate) {
      this.toastrService.warning("Select dates first");
      return;
    }
    if (!this.rental.customerId && this.customers.length > 0) {
      this.rental.customerId = this.customers[0].userId?.toString();
    }
    this.rental.totalRentPrice = this.calculateTotalPrice();
    if (this.isEditing) {
      this.rentalService.updateRental(this.rental).subscribe(res => {
        this.toastrService.success("Rental updated");
        this.loadRentals(this.selectedCar!.carId);
        this.isEditing = false;
      });
    } else {
      this.rentalService.addRental(this.rental).subscribe(res => {
        this.toastrService.success("Car rented!");
        this.loadRentals(this.selectedCar!.carId);
      }, err => {
        this.toastrService.error("Could not rent car");
      });
    }
  }

  deleteRental(rentalId: number) {
    if (confirm("Cancel this rental?")) {
      this.rentalService.deleteRental(rentalId).subscribe(res => {
        this.toastrService.info("Cancelled");
        this.loadRentals(this.selectedCar!.carId);
      });
    }
  }
}
