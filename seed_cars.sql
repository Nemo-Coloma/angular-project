-- Reset cars and car_images
DELETE FROM car_images;
DELETE FROM cars;

-- Insert 10 Real-world Cars
-- Note: id values are based on the brand and color seeding
INSERT INTO cars (car_id, brand_id, color_id, model_year, daily_price, description) VALUES
(1, 1, 1, 2023, 1500, 'Tesla Model 3 Performance - All-Wheel Drive, 0-60 mph in 3.1s'),
(2, 2, 2, 2022, 1200, 'BMW M4 Competition - 503 HP, 3.0L M TwinPower Turbo Inline 6-Cylinder'),
(3, 3, 3, 2023, 1800, 'Mercedes-Benz S-Class - 4.0L V8 Biturbo with MHEV, Luxury and Technology'),
(4, 4, 4, 2022, 1100, 'Audi RS5 Sportback - 444 HP, Quattro All-Wheel Drive, 2.9L biturbo V6'),
(5, 5, 5, 2023, 2500, 'Porsche 911 Carrera S - 443 HP, Rear-Engine layout, Iconic Performance'),
(6, 6, 1, 2023, 600, 'Toyota Camry XSE - 2.5L 4-Cylinder, Premium Leather Seats, JBL Audio'),
(7, 7, 2, 2022, 550, 'Honda Civic Type R - 315 HP, 6-Speed Manual Transmission, Front-Wheel Drive'),
(8, 8, 4, 2023, 900, 'Ford Mustang Mach-E - All-Electric SUV, Extended Range Battery, GT Performance'),
(9, 9, 3, 2022, 850, 'Chevrolet Corvette C8 - 495 HP, Mid-Engine V8, 0-60 in 2.9s'),
(10, 10, 7, 2023, 5000, 'Lamborghini Huracán Evo - 631 HP, 5.2L V10, Aerodinamica Lamborghini Attiva');

-- Map Images (using the local placeholder names found in src/assets/Img)
INSERT INTO car_images (car_id, image_path, date) VALUES
(1, 'c-1.png', NOW()),
(2, 'c-2.png', NOW()),
(3, 'c-3.png', NOW()),
(4, 'r-1.png', NOW()),
(5, 'r-2.png', NOW()),
(6, 'r-3.png', NOW()),
(7, 'r-4.png', NOW()),
(8, 'r-5.png', NOW()),
(9, 'r-6.png', NOW()),
(10, 'hero-img.jpg', NOW());
