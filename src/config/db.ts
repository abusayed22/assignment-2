import { Pool } from "pg";
import config from ".";


export const pool = new Pool({
    connectionString: `${config.connectStr}`
})

const initDb = async() => {
    // User
    await pool.query(`CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(200) UNIQUE NOT NULL, 
        password TEXT NOT NULL,
        phone VARCHAR(15),
        role VARCHAR(20),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        )`)

    // Vehicles
    await pool.query(`CREATE TABLE IF NOT EXISTS vehicles(
        id SERIAL PRIMARY KEY,
        vehicle_name VARCHAR(100) NOT NULL,
        type VARCHAR(50) NOT NULL CHECK(type IN('car','bike','van','SUV')),
        registration_number VARCHAR(100) NOT NULL UNIQUE,
        daily_rent_price DECIMAL(10,2) NOT NULL CHECK (daily_rent_price > 0),
        availability_status VARCHAR(50) DEFAULT 'available' CHECK (availability_status IN('available','booked')),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        )`)


    // Bookings
    await pool.query(`CREATE TABLE IF NOT EXISTS bookings(
        id SERIAL PRIMARY KEY,
        customer_id INT REFERENCES users(id) ON DELETE CASCADE,
        vehicle_id INT REFERENCES vehicles(id) ON DELETE CASCADE,
        rent_start_date DATE,
        total_price DECIMAL(10,2),
        status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'returned')),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        )`);


        // console.log("Database tables initialized successfully");
};







export default initDb;