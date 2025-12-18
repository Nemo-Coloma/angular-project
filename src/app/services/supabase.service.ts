import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SupabaseService {
    private supabase: SupabaseClient;

    constructor() {
        this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    }

    get client() {
        return this.supabase;
    }

    // Example method to fetch data
    async getBrands() {
        const { data, error } = await this.supabase
            .from('brands')
            .select('*');

        if (error) throw error;
        return data;
    }

    // Add more methods as needed for your entities
}
