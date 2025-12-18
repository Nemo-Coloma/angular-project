export interface Rental {
    rentalId?: number;
    carId: number;
    customerId?: string; // UUID from Supabase
    rentDate?: Date;
    returnDate?: Date;
    totalRentPrice?: number;

    // Optional UI properties
    carName?: string;
    customerName?: string;
}
