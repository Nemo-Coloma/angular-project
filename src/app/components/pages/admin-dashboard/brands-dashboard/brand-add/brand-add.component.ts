import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Brand } from 'src/app/models/brand';
import { BrandService } from 'src/app/services/brand.service';

@Component({
  selector: 'app-brand-add',
  templateUrl: './brand-add.component.html',
  styleUrls: ['./brand-add.component.css']
})
export class BrandAddComponent implements OnInit {
  brands: Brand[] = [];
  brandAddForm: FormGroup;

  constructor(
    private brandService: BrandService,
    private toastrService: ToastrService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.createBrandForm();
  }

  createBrandForm() {
    this.brandAddForm = this.formBuilder.group({
      brandName: ["", Validators.required]
    })
  }

  addBrand() {
    if (this.brandAddForm.valid) {
      let brandData = this.brandAddForm.value;
      this.brandService.addBrand(brandData).subscribe(res => {
        this.toastrService.success("Brand added");
      }, err => {
        this.toastrService.error("Could not add brand");
      })
    } else {
      this.toastrService.error("Form is empty");
    }
  }
}
