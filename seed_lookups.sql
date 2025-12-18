-- Reset and seed Brands
DELETE FROM brands;
INSERT INTO brands (brand_id, brand_name) VALUES
(1, 'Tesla'),
(2, 'BMW'),
(3, 'Mercedes-Benz'),
(4, 'Audi'),
(5, 'Porsche'),
(6, 'Toyota'),
(7, 'Honda'),
(8, 'Ford'),
(9, 'Chevrolet'),
(10, 'Lamborghini');

-- Reset and seed Colors
DELETE FROM colors;
INSERT INTO colors (color_id, color_name) VALUES
(1, 'White'),
(2, 'Black'),
(3, 'Grey'),
(4, 'Blue'),
(5, 'Red'),
(6, 'Silver'),
(7, 'Yellow');
