import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Brand } from 'src/app/models/brand';
import { Car } from 'src/app/models/car';
import { CarImage } from 'src/app/models/carImage';
import { Color } from 'src/app/models/color';
import { BrandService } from 'src/app/services/brand.service';
import { CarImageService } from 'src/app/services/car-image.service';
import { CarService } from 'src/app/services/car.service';
import { ColorService } from 'src/app/services/color.service';

@Component({
  selector: 'app-car-edit',
  templateUrl: './car-edit.component.html',
  styleUrls: ['./car-edit.component.css']
})
export class CarEditComponent implements OnInit {
  car: Car;
  carImages: CarImage[] = [];
  carUpdateForm: FormGroup;
  colors: Color[] = [];
  brands: Brand[] = [];
  modelYearList: number[] = [];

  constructor(
    private carService: CarService,
    private activatedRoute: ActivatedRoute,
    private toastrService: ToastrService,
    private router: Router,
    private formBuilder: FormBuilder,
    private colorService: ColorService,
    private brandService: BrandService,
    private carImageService: CarImageService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      if (params["carId"]) {
        this.createUpdateForm();
        this.getCurrentCar(params["carId"]);
        this.getColors();
        this.getBrands();
        this.createModelYearList();
        this.getImages(params["carId"]);
      }
    });
  }

  createModelYearList() {
    let year = new Date().getFullYear();
    for (let i = year + 1; i >= 1950; i--) {
      this.modelYearList.push(i);
    }
  }

  getColors() {
    this.colorService.getColors().subscribe(res => {
      this.colors = res.data;
    });
  }

  getBrands() {
    this.brandService.getBrands().subscribe(res => {
      this.brands = res.data;
    });
  }

  getImages(carId: number) {
    this.carImageService.getCarImages(carId).subscribe(res => {
      this.carImages = res.data;
    });
  }

  getCurrentCar(carId: number) {
    this.carService.getCarById(carId).subscribe(res => {
      this.car = res.data;
      this.carUpdateForm.patchValue({
        carId: this.car.carId,
        carName: this.car.carName,
        colorId: this.car.colorId,
        brandId: this.car.brandId,
        modelYear: this.car.modelYear,
        dailyPrice: this.car.dailyPrice,
        description: this.car.description
      });
    });
  }

  createUpdateForm() {
    this.carUpdateForm = this.formBuilder.group({
      carId: ["", Validators.required],
      carName: ["", Validators.required],
      colorId: ["", Validators.required],
      brandId: ["", Validators.required],
      modelYear: ["", Validators.required],
      dailyPrice: ["", Validators.required],
      description: ["", Validators.required]
    });
  }

  updateCar() {
    if (this.carUpdateForm.valid) {
      let carData = this.carUpdateForm.value;
      this.carService.updateCar(carData).subscribe(res => {
        this.toastrService.success("Car updated");
        this.router.navigate(['/admin/cars']);
      }, err => {
        this.toastrService.error("Update failed");
      });
    } else {
      this.toastrService.warning("Fill the form");
    }
  }

  deleteCar() {
    if (confirm("Delete car?")) {
      this.carService.deleteCar(this.car).subscribe(res => {
        this.toastrService.success("Car deleted");
        this.router.navigate(['admin', 'cars']);
      }, err => {
        this.toastrService.error("Delete failed");
      }
      );
    }
  }
}
