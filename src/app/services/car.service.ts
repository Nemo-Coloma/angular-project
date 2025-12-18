import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ListResponseModel } from '../models/listResponseModel';
import { Car } from '../models/car';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CarService {
  private apiUrl = `${environment.supabaseUrl}/rest/v1`;

  constructor(private httpClient: HttpClient) { }

  private get headers() {
    return new HttpHeaders({
      'apikey': environment.supabaseKey,
      'Authorization': `Bearer ${environment.supabaseKey}`,
      'Content-Type': 'application/json'
    });
  }

  getCars(): Observable<ListResponseModel<Car>> {
    return this.httpClient.get<any[]>(`${this.apiUrl}/cars?select=*,brands(name),colors(name)`, { headers: this.headers }).pipe(
      map(data => {
        const cars: Car[] = data.map(item => ({
          carId: item.id,
          carName: item.name,
          brandId: item.brand_id,
          colorId: item.color_id,
          brandName: item.brands?.name || 'Unknown',
          colorName: item.colors?.name || 'Unknown',
          modelYear: item.model_year,
          dailyPrice: item.daily_price,
          description: item.description,
          imagePath: item.image_path
        }));

        if (cars.length === 0) {
          return {
            success: true,
            message: "Fetched mock data as DB is empty",
            data: this.getMockCars()
          };
        }

        return {
          success: true,
          message: "Cars listed successfully",
          data: cars
        };
      }),
      catchError(err => {
        return of({
          success: true,
          message: "Error fetching from Supabase, showing mock data",
          data: this.getMockCars()
        });
      })
    );
  }

  getMockCars(): Car[] {
    return [
      { carId: 1, brandId: 1, colorId: 1, carName: 'Tesla Model 3', brandName: 'Tesla', colorName: 'White', modelYear: 2023, dailyPrice: 8500, description: 'Tesla Model 3 Performance - All-Wheel Drive, 0-60 mph in 3.1s', imagePath: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=2071&auto=format&fit=crop' },
      { carId: 2, brandId: 2, colorId: 2, carName: 'BMW M4', brandName: 'BMW', colorName: 'Black', modelYear: 2022, dailyPrice: 12000, description: 'BMW M4 Competition - 503 HP, 3.0L M TwinPower Turbo Inline 6-Cylinder', imagePath: 'https://images.unsplash.com/photo-1617814076367-b759c7d82666?q=80&w=2070&auto=format&fit=crop' },
      { carId: 3, brandId: 3, colorId: 3, carName: 'Mercedes-Benz S-Class', brandName: 'Mercedes-Benz', colorName: 'Grey', modelYear: 2023, dailyPrice: 15000, description: 'Mercedes-Benz S-Class - Luxury and Technology with V8 Biturbo', imagePath: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=2070&auto=format&fit=crop' },
      { carId: 4, brandId: 4, colorId: 4, carName: 'Audi RS5', brandName: 'Audi', colorName: 'Blue', modelYear: 2022, dailyPrice: 9500, description: 'Audi RS5 Sportback - 444 HP, Quattro All-Wheel Drive, biturbo V6', imagePath: 'https://images.unsplash.com/photo-1606148632399-5c942976bc9e?q=80&w=2070&auto=format&fit=crop' },
      { carId: 5, brandId: 5, colorId: 5, carName: 'Porsche 911', brandName: 'Porsche', colorName: 'Red', modelYear: 2023, dailyPrice: 25000, description: 'Porsche 911 Carrera S - Iconic performance, 443 HP', imagePath: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop' },
      { carId: 6, brandId: 6, colorId: 1, carName: 'Toyota Camry', brandName: 'Toyota', colorName: 'White', modelYear: 2023, dailyPrice: 4500, description: 'Toyota Camry XSE - 2.5L 4-Cylinder, Premium Leather Seats', imagePath: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=2070&auto=format&fit=crop' },
      { carId: 7, brandId: 7, colorId: 2, carName: 'Honda Civic Type R', brandName: 'Honda', colorName: 'Black', modelYear: 2022, dailyPrice: 5000, description: 'Honda Civic Type R - 315 HP, 6-Speed Manual Transmission', imagePath: 'https://images.unsplash.com/photo-1594960533310-4ed330960517?q=80&w=2070&auto=format&fit=crop' },
      { carId: 8, brandId: 8, colorId: 4, carName: 'Ford Mustang Mach-E', brandName: 'Ford', colorName: 'Blue', modelYear: 2023, dailyPrice: 8000, description: 'Ford Mustang Mach-E - All-Electric SUV, Extended Range GT', imagePath: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?q=80&w=2070&auto=format&fit=crop' },
      { carId: 9, brandId: 9, colorId: 3, carName: 'Chevrolet Corvette C8', brandName: 'Chevrolet', colorName: 'Grey', modelYear: 2022, dailyPrice: 18000, description: 'Chevrolet Corvette C8 - 495 HP, Mid-Engine V8', imagePath: 'https://images.unsplash.com/photo-1592198084033-aade902d1aae?q=80&w=2070&auto=format&fit=crop' },
      { carId: 10, brandId: 10, colorId: 7, carName: 'Lamborghini Huracán', brandName: 'Lamborghini', colorName: 'Yellow', modelYear: 2023, dailyPrice: 45000, description: 'Lamborghini Huracán Evo - 631 HP, 5.2L V10 Supercar', imagePath: 'https://images.unsplash.com/photo-1544636331-e268592033c2?q=80&w=2070&auto=format&fit=crop' }
    ];
  }

  // Update other methods for parity
  getCarsByBrand(brandId: number): Observable<ListResponseModel<Car>> {
    return this.getCars().pipe(map(res => ({ ...res, data: res.data.filter(c => c.brandId == brandId) })));
  }

  getCarsByColor(colorId: number): Observable<ListResponseModel<Car>> {
    return this.getCars().pipe(map(res => ({ ...res, data: res.data.filter(c => c.colorId == colorId) })));
  }

  getCarsBySelect(brandId: number, colorId: number): Observable<ListResponseModel<Car>> {
    return this.getCars().pipe(map(res => ({ ...res, data: res.data.filter(c => c.brandId == brandId && c.colorId == colorId) })));
  }

  getCarDetail(carId: number): Observable<ListResponseModel<Car>> {
    return this.getCars().pipe(map(res => ({ ...res, data: res.data.filter(c => c.carId == carId) })));
  }

  getCarById(carId: number): Observable<any> {
    return this.httpClient.get<any[]>(`${this.apiUrl}/cars?id=eq.${carId}&select=*,brands(name),colors(name)`, { headers: this.headers }).pipe(
      map(data => {
        if (data.length === 0) return { success: false, message: "Car not found" };
        const item = data[0];
        const car: Car = {
          carId: item.id,
          carName: item.name,
          brandId: item.brand_id,
          colorId: item.color_id,
          brandName: item.brands?.name || 'Unknown',
          colorName: item.colors?.name || 'Unknown',
          modelYear: item.model_year,
          dailyPrice: item.daily_price,
          description: item.description,
          imagePath: item.image_path
        };
        return { success: true, data: car };
      })
    );
  }

  addCar(car: any): Observable<any> {
    const body = {
      name: car.carName,
      brand_id: car.brandId,
      color_id: car.colorId,
      model_year: car.modelYear,
      daily_price: car.dailyPrice,
      description: car.description,
      image_path: car.imagePath
    };
    return this.httpClient.post(`${this.apiUrl}/cars`, body, { headers: this.headers });
  }

  updateCar(car: any): Observable<any> {
    const body = {
      name: car.carName,
      brand_id: car.brandId,
      color_id: car.colorId,
      model_year: car.modelYear,
      daily_price: car.dailyPrice,
      description: car.description,
      image_path: car.imagePath
    };
    return this.httpClient.patch(`${this.apiUrl}/cars?id=eq.${car.carId}`, body, { headers: this.headers });
  }

  deleteCar(car: any): Observable<any> {
    return this.httpClient.delete(`${this.apiUrl}/cars?id=eq.${car.carId}`, { headers: this.headers });
  }

  deletCar(car: any): Observable<any> {
    return this.deleteCar(car);
  }

  getAllCarDetail(): Observable<ListResponseModel<Car>> {
    return this.getCars();
  }
}
