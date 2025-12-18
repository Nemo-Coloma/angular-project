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

  // Rental Modal State
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
      }
      else if (params["colorId"]) {
        this.getCarsByColor(params["colorId"]);
      }
      else if (params["brandId"]) {
        this.getCarsByBrand(params["brandId"])
      }
      else {
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
    this.carService.getCars().subscribe(response => {
      this.cars = response.data;
      this.dataLoaded = true;
    })
  }

  getCarsByBrand(brandId: number) {
    this.carService.getCarsByBrand(brandId).subscribe(response => {
      this.cars = response.data;
      this.dataLoaded = true;
    })
  }

  getCarsByColor(colorId: number) {
    this.carService.getCarsByColor(colorId).subscribe(response => {
      this.cars = response.data;
      this.dataLoaded = true;
    })
  }

  getCarsBySelect(brandId: number, colorId: number) {
    this.carService.getCarsBySelect(brandId, colorId).subscribe(response => {
      this.cars = response.data
      this.dataLoaded = true;
    })
  }

  // Rental Modal Methods
  openRentModal(car: Car) {
    this.selectedCar = car;
    this.rental = {
      carId: car.carId,
      customerId: this.customers[0]?.userId?.toString() || '',
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

  calculateTotalPrice(): number {
    if (this.rental.rentDate && this.rental.returnDate && this.selectedCar) {
      const date1 = new Date(this.rental.rentDate);
      const date2 = new Date(this.rental.returnDate);
      const diffTime = Math.abs(date2.getTime() - date1.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return (diffDays || 1) * this.selectedCar.dailyPrice;
    }
    return this.selectedCar?.dailyPrice || 0;
  }

  saveRental() {
    if (!this.rental.rentDate || !this.rental.returnDate || !this.rental.customerId) {
      this.toastrService.warning("Please select both dates and a customer");
      return;
    }

    this.rental.totalRentPrice = this.calculateTotalPrice();

    if (this.isEditing) {
      this.rentalService.updateRental(this.rental).subscribe(res => {
        this.toastrService.success("Rental updated successfully");
        this.loadRentals(this.selectedCar!.carId);
        this.isEditing = false;
        this.rental = { carId: this.selectedCar!.carId, rentDate: new Date(), customerId: this.rental.customerId };
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
}
