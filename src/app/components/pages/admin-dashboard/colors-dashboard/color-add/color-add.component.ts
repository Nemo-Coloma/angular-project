import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Color } from 'src/app/models/color';
import { ColorService } from 'src/app/services/color.service';

@Component({
  selector: 'app-color-add',
  templateUrl: './color-add.component.html',
  styleUrls: ['./color-add.component.css']
})
export class ColorAddComponent implements OnInit {
  colors: Color[] = [];
  colorAddForm: FormGroup;
  dataLoaded = false;

  constructor(
    private colorService: ColorService,
    private toastrService: ToastrService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.colorAddForm = this.formBuilder.group({
      colorName: ["", Validators.required]
    })
  }

  addColor() {
    if (this.colorAddForm.valid) {
      let colorData = this.colorAddForm.value;
      this.colorService.addColor(colorData).subscribe(res => {
        this.toastrService.success("Color added");
        this.router.navigate(['admin', 'colors']);
      }, err => {
        this.toastrService.error("Could not add color");
      })
    } else {
      this.toastrService.error("Form is missing data");
    }
  }
}
