import { Component, OnInit } from '@angular/core';
import { Car } from 'src/app/models/car';
import { CarImage } from 'src/app/models/carImage';
import { CarService } from 'src/app/services/car.service';
import { RentalService } from 'src/app/services/rental.service';
import { CustomerService } from 'src/app/services/customer.service';
import { Rental } from 'src/app/models/rental';
import { Customer } from 'src/app/models/customer';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  cars: Car[] = [];
  customers: Customer[] = [];
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
    private customerService: CustomerService,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.getCars()
    this.getCustomers();
  }

  getCustomers() {
    this.customerService.getCustomer().subscribe(res => {
      this.customers = res.data;
    });
  }

  getCars() {
    this.carService.getCars().subscribe(response => {
      this.cars = response.data.slice(0, 6);
      this.dataLoaded = true;
    })
  }

  openRentModal(car: Car) {
    this.selectedCar = car;
    const today = new Date().toISOString().split('T')[0];
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
      const date1 = new Date(this.rental.rentDate);
      const date2 = new Date(this.rental.returnDate);
      const diffTime = Math.abs(date2.getTime() - date1.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return (diffDays || 1) * this.selectedCar.dailyPrice;
    }
    return this.selectedCar?.dailyPrice || 0;
  }

  saveRental() {
    console.log("Current Home Rental State:", this.rental);
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
        const today = new Date().toISOString().split('T')[0];
        this.rental = { carId: this.selectedCar!.carId, rentDate: today as any, customerId: this.rental.customerId };
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
