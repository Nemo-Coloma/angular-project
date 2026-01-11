import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CarService } from '../../../../../services/car.service';
import { BrandService } from '../../../../../services/brand.service';
import { ColorService } from '../../../../../services/color.service';
import { ToastrService } from 'ngx-toastr';
import { Brand } from 'src/app/models/brand';
import { Color } from 'src/app/models/color';
import { Router } from '@angular/router';

@Component({
  selector: 'app-car-add',
  templateUrl: './car-add.component.html',
  styleUrls: ['./car-add.component.css']
})
export class CarAddComponent implements OnInit {
  brands: Brand[] = [];
  colors: Color[] = [];
  carAddForm: FormGroup;

  constructor(
    private carService: CarService,
    private brandService: BrandService,
    private colorService: ColorService,
    private toastrService: ToastrService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.createCarAddForm();
    this.getBrands();
    this.getColors();
  }

  getBrands() {
    this.brandService.getBrands().subscribe(res => {
      this.brands = res.data;
    })
  }

  getColors() {
    this.colorService.getColors().subscribe(res => {
      this.colors = res.data;
    })
  }

  createCarAddForm() {
    this.carAddForm = this.formBuilder.group({
      brandId: ["", Validators.required],
      colorId: ["", Validators.required],
      carName: ["", Validators.required],
      dailyPrice: ["", Validators.required],
      modelYear: ["", Validators.required],
      description: ["", Validators.required]
    })
  }

  addCar() {
    if (this.carAddForm.valid) {
      let carData = this.carAddForm.value;
      this.carService.addCar(carData).subscribe(res => {
        this.toastrService.success("Car added");
        this.router.navigate(['admin', 'cars']);
      }, err => {
        this.toastrService.error("Could not add car");
      })
    } else {
      this.toastrService.error("Form is missing data");
    }
  }
}
