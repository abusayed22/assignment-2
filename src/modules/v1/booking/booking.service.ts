import { pool } from "../../../config/db"


const createBooking = async(customerId: number, vehicleId: number, startDate: string,endDate: string) => {

    const client = pool.connect();

    try {
        (await client).query("BEGIN");

        const vehicleResult = await pool.query(
            `SELECT daily_rent_price, availability_status FROM vehicles WHERE id = $1 FOR UPDATE`, 
            [vehicleId]
        );
        

        if (vehicleResult.rows.length === 0) {
            throw new Error("Vehicle not found");
        }

        const vehicle = vehicleResult.rows[0];

        if (vehicle.availability_status !== 'available') {
            throw new Error("Vehicle is already booked");
        }


        const start = new Date(startDate);
        const end = new Date(endDate);

        const diffTime = Math.abs(end.getTime() - start.getTime());
        const durationInDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (durationInDays <= 0) {
            throw new Error("End date must be after start date");
        }
        
        const totalPrice = durationInDays * Number(vehicle.daily_rent_price);

        const bookingResult = await pool.query(`INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) VALUES ($1, $2, $3, $4, $5, 'active') RETURNING *`, [customerId, vehicleId, startDate, endDate, totalPrice]);

        await pool.query(
            `UPDATE vehicles SET availability_status = 'booked' WHERE id = $1`,
            [vehicleId]
        );

        (await client).query('COMMIT');

        return bookingResult.rows[0];

    } catch (error) {
         (await client).query('ROLLBACK');
        throw error;
    }finally {
        (await client).release(); 
    }

}


const viewBookings = async (userId: number, role: string) => {
    let query = "";
    let values: any[] = [];

    if (role === "admin") {
        // ADMIN QUERY: Get ALL bookings + User Details + Vehicle Details
        query = `
            SELECT 
                b.id, b.customer_id, b.vehicle_id, b.rent_start_date, b.rent_end_date, b.total_price, b.status,
                u.name AS customer_name, u.email AS customer_email,
                v.vehicle_name, v.registration_number
            FROM bookings b
            JOIN users u ON b.customer_id = u.id
            JOIN vehicles v ON b.vehicle_id = v.id
        `;
    } else {
        // CUSTOMER QUERY: Get ONLY own bookings + Vehicle Details (No User Details needed)
        query = `
            SELECT 
                b.id, b.vehicle_id, b.rent_start_date, b.rent_end_date, b.total_price, b.status,
                v.vehicle_name, v.registration_number, v.type
            FROM bookings b
            JOIN vehicles v ON b.vehicle_id = v.id
            WHERE b.customer_id = $1
        `;
        values = [userId];
    }

    const result = await pool.query(query, values);

    // DATA MAPPING: Convert flat SQL rows into the nested JSON structure you want
    const formattedData = result.rows.map((row) => {
        
        // Base object (Common fields)
        const booking: any = {
            id: row.id,
            vehicle_id: row.vehicle_id,
            rent_start_date: row.rent_start_date, // Postgres usually returns Date object
            rent_end_date: row.rent_end_date,
            total_price: row.total_price,
            status: row.status,
            vehicle: {
                vehicle_name: row.vehicle_name,
                registration_number: row.registration_number,
                type: row.type, // Only present for customer based on your example
            }
        };

        // ADMIN ONLY: Add customer object and customer_id field
        if (role === "admin") {
            booking.customer_id = row.customer_id;
            booking.customer = {
                name: row.customer_name,
                email: row.customer_email
            };
            // Remove 'type' from vehicle if admin doesn't need it (optional, based on your JSON)
            delete booking.vehicle.type; 
        }

        return booking;
    });

    return formattedData;

};




const updateBookingStatus = async (bookingId: number, status: string) => {
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');

        // 1. Check if booking exists and get vehicle_id
        const bookingResult = await client.query(
            `SELECT * FROM bookings WHERE id = $1`, 
            [bookingId]
        );

        if (bookingResult.rows.length === 0) {
            throw new Error("Booking not found");
        }

        const booking = bookingResult.rows[0];

        // 2. Update the Booking Status
        const updateQuery = `
            UPDATE bookings 
            SET status = $1, updated_at = NOW() 
            WHERE id = $2 
            RETURNING *
        `;
        const updatedBooking = await client.query(updateQuery, [status, bookingId]);

        // 3. SMART LOGIC: If booking is finished, free up the car
        if (status === 'returned' || status === 'cancelled') {
            await client.query(
                `UPDATE vehicles SET availability_status = 'available' WHERE id = $1`,
                [booking.vehicle_id]
            );
        }

        await client.query('COMMIT');
        return updatedBooking.rows[0];

    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};



export const bookingService = {
    createBooking,
    viewBookings,
    updateBookingStatus,
}