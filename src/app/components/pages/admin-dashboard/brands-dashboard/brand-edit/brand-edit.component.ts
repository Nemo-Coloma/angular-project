import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Brand } from 'src/app/models/brand';
import { BrandService } from 'src/app/services/brand.service';

@Component({
  selector: 'app-brand-edit',
  templateUrl: './brand-edit.component.html',
  styleUrls: ['./brand-edit.component.css']
})
export class BrandEditComponent implements OnInit {
  brand: Brand;
  brandEditForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private brandService: BrandService,
    private toastrService: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.createForm()
    this.activatedRoute.params.subscribe(params => {
      if (params["brandId"]) {
        this.getBrand(params["brandId"])
      }
    })
  }

  createForm() {
    this.brandEditForm = this.formBuilder.group({
      brandName: ["", Validators.required]
    })
  }

  getBrand(brandId: number) {
    this.brandService.getById(brandId).subscribe(res => {
      this.brand = res.data;
      this.brandEditForm.patchValue({
        brandName: this.brand.brandName
      });
    });
  }

  updateBrand() {
    if (this.brandEditForm.valid) {
      let brandData = this.brandEditForm.value;
      brandData.brandId = this.brand.brandId;
      this.brandService.updateBrand(brandData).subscribe(res => {
        this.toastrService.success("Brand updated");
      }, err => {
        this.toastrService.error("Update failed");
      })
    } else {
      this.toastrService.error("Fill the form");
    }
  }

  deleteBrand() {
    if (confirm("Delete brand?")) {
      this.brandService.deleteBrand(this.brand).subscribe(res => {
        this.toastrService.success("Brand deleted");
        this.router.navigate(['admin', 'brands']);
      }, err => {
        this.toastrService.error("Delete failed");
      }
      );
    }
  }
}
