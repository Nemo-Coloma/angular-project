import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ListResponseModel } from '../models/listResponseModel';
import { Car } from '../models/car';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CarService {
  private apiUrl = environment.supabaseUrl + "/rest/v1";

  constructor(private httpClient: HttpClient) { }

  getHeaders() {
    return new HttpHeaders({
      'apikey': environment.supabaseKey,
      'Authorization': 'Bearer ' + environment.supabaseKey,
      'Content-Type': 'application/json'
    });
  }

  getCars(): Observable<ListResponseModel<Car>> {
    return of({
      success: true,
      message: "Cars loaded",
      data: this.getMockCars()
    });
  }

  getMockCars(): Car[] {
    return [
      { carId: 1, brandId: 6, colorId: 1, carName: 'Toyota Innova', brandName: 'Toyota', colorName: 'Black', modelYear: 2023, dailyPrice: 3500, description: 'Toyota Innova - Family MPV.', imagePath: 'https://business.inquirer.net/files/2024/02/toyota-innova-xe-2.png' },
      { carId: 2, brandId: 6, colorId: 2, carName: 'Toyota Vios', brandName: 'Toyota', colorName: 'Black', modelYear: 2023, dailyPrice: 2000, description: 'Toyota Vios - Efficient sedan.', imagePath: 'https://wallpapercave.com/wp/wp8600596.jpg' },
      { carId: 3, brandId: 6, colorId: 3, carName: 'Toyota Fortuner', brandName: 'Toyota', colorName: 'Black', modelYear: 2023, dailyPrice: 4500, description: 'Toyota Fortuner - Powerful SUV.', imagePath: 'https://images.carexpert.com.au/crop/1398/930/cms/v1/media/2025-05-2025-toyota-fortuner-gxlhero-3x2-1.jpg' },
      { carId: 4, brandId: 11, colorId: 4, carName: 'Mitsubishi Mirage G4', brandName: 'Mitsubishi', colorName: 'Grey', modelYear: 2022, dailyPrice: 1800, description: 'Mitsubishi Mirage G4 - Fuel-efficient sedan.', imagePath: 'https://hips.hearstapps.com/amv-prod-cad-assets.s3.amazonaws.com/vdat/submodels/mitsubishi_mirage-g4_mitsubishi-mirage-g4_2019-1642710732555.jpg?fill=18:11&resize=640:*' },
      { carId: 5, brandId: 11, colorId: 2, carName: 'Mitsubishi Montero Sport', brandName: 'Mitsubishi', colorName: 'White', modelYear: 2023, dailyPrice: 4500, description: 'Mitsubishi Montero Sport - Sophisticated SUV.', imagePath: 'https://i.ytimg.com/vi/5WC4SuzbUFQ/maxresdefault.jpg' },
      { carId: 6, brandId: 6, colorId: 1, carName: 'Toyota Wigo', brandName: 'Toyota', colorName: 'Silver', modelYear: 2023, dailyPrice: 1500, description: 'Toyota Wigo - Compact car.', imagePath: 'https://d1hv7ee95zft1i.cloudfront.net/custom/blog-post-photo/gallery/toyota-wigo-front-quarter-road-5e9fd1f544147.jpg' },
      { carId: 7, brandId: 11, colorId: 2, carName: 'Mitsubishi Xpander', brandName: 'Mitsubishi', colorName: 'Grey', modelYear: 2022, dailyPrice: 3500, description: 'Mitsubishi Xpander - Stylish MPV.', imagePath: 'https://visor.ph/wp-content/uploads/2024/10/Sam-XpanderGLS-2.jpg' },
      { carId: 8, brandId: 12, colorId: 4, carName: 'Nissan Navara', brandName: 'Nissan', colorName: 'Grey', modelYear: 2023, dailyPrice: 4000, description: 'Nissan Navara - Tough pickup.', imagePath: 'https://img.philkotse.com/crop/640x360/2022/01/19/KjJYY7r3/img-9655-c36a_wm.jpg' },
      { carId: 9, brandId: 13, colorId: 3, carName: 'Isuzu D-Max', brandName: 'Isuzu', colorName: 'White', modelYear: 2022, dailyPrice: 4000, description: 'Isuzu D-Max - Dependable workhorse.', imagePath: 'https://nzsuv.co.nz/sites/nz4wd/public/styles/x-large/public/article/image/Isuzu%20D-Max%20refreshed.jpg?itok=dWVzIgWs' },
      { carId: 10, brandId: 6, colorId: 1, carName: 'Toyota Hiace Grandia', brandName: 'Toyota', colorName: 'Light-Brown', modelYear: 2023, dailyPrice: 5000, description: 'Toyota Hiace Grandia - Large group travel.', imagePath: 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?q=80&w=2070&auto=format&fit=crop' }
    ];
  }

  getCarsByBrand(brandId: number): Observable<ListResponseModel<Car>> {
    return this.getCars().pipe(
      map(res => {
        res.data = res.data.filter(c => c.brandId == brandId);
        return res;
      })
    );
  }

  getCarsByColor(colorId: number): Observable<ListResponseModel<Car>> {
    return this.getCars().pipe(
      map(res => {
        res.data = res.data.filter(c => c.colorId == colorId);
        return res;
      })
    );
  }

  getCarsBySelect(brandId: number, colorId: number): Observable<ListResponseModel<Car>> {
    return this.getCars().pipe(
      map(res => {
        res.data = res.data.filter(c => c.brandId == brandId && c.colorId == colorId);
        return res;
      })
    );
  }

  getCarDetail(carId: number): Observable<ListResponseModel<Car>> {
    return this.getCars().pipe(
      map(res => {
        res.data = res.data.filter(c => c.carId == carId);
        return res;
      })
    );
  }

  getCarById(carId: number): Observable<any> {
    const car = this.getMockCars().find(c => c.carId === carId);
    if (car) {
      return of({ success: true, data: car });
    } else {
      return of({ success: false, message: "Car not found" });
    }
  }

  addCar(car: any): Observable<any> {
    const carData = {
      name: car.carName,
      brand_id: car.brandId,
      color_id: car.colorId,
      model_year: car.modelYear,
      daily_price: car.dailyPrice,
      description: car.description,
      image_path: car.imagePath
    };
    return this.httpClient.post(this.apiUrl + '/cars', carData, { headers: this.getHeaders() });
  }

  updateCar(car: any): Observable<any> {
    const carData = {
      name: car.carName,
      brand_id: car.brandId,
      color_id: car.colorId,
      model_year: car.modelYear,
      daily_price: car.dailyPrice,
      description: car.description,
      image_path: car.imagePath
    };
    return this.httpClient.patch(this.apiUrl + '/cars?id=eq.' + car.carId, carData, { headers: this.getHeaders() });
  }

  deleteCar(car: any): Observable<any> {
    return this.httpClient.delete(this.apiUrl + '/cars?id=eq.' + car.carId, { headers: this.getHeaders() });
  }

  getAllCarDetail(): Observable<ListResponseModel<Car>> {
    return this.getCars();
  }
}
