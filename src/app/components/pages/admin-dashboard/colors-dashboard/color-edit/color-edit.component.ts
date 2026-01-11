import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Color } from "src/app/models/color";
import { ColorService } from "src/app/services/color.service";

@Component({
  selector: 'app-color-edit',
  templateUrl: './color-edit.component.html',
  styleUrls: ['./color-edit.component.css']
})
export class ColorEditComponent implements OnInit {
  color: Color;
  colorEditForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private colorService: ColorService,
    private toastrService: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.createForm()
    this.activatedRoute.params.subscribe(params => {
      if (params["colorId"]) {
        this.getColor(params["colorId"])
      }
    })
  }

  createForm() {
    this.colorEditForm = this.formBuilder.group({
      colorName: ["", Validators.required]
    })
  }

  getColor(colorId: number) {
    this.colorService.getById(colorId).subscribe(res => {
      this.color = res.data;
      this.colorEditForm.patchValue({
        colorName: this.color.colorName
      });
    });
  }

  updateColor() {
    if (this.colorEditForm.valid) {
      let colorData = this.colorEditForm.value;
      colorData.colorId = this.color.colorId;
      this.colorService.updateColor(colorData).subscribe(res => {
        this.toastrService.success("Color updated");
        this.router.navigate(['admin', 'colors']);
      }, err => {
        this.toastrService.error("Update failed");
      })
    } else {
      this.toastrService.error("Fill the form");
    }
  }

  deleteColor() {
    if (confirm("Delete color?")) {
      this.colorService.deleteColor(this.color).subscribe(res => {
        this.toastrService.success("Color deleted");
        this.router.navigate(['admin', 'colors']);
      }, err => {
        this.toastrService.error("Delete failed");
      }
      );
    }
  }
}
