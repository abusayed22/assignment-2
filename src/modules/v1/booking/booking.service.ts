import { pool } from "../../../config/db"

    const calculateDays = (start: string, end: string) => {
        const startDate = new Date(start);
        const endDate = new Date(end)
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    }


const createBooking = async (customerId: number, vehicleId: number, start: string, end: string) => {

        // checking vehicle
        const vehicle = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [vehicleId]);

        const user = await pool.query(`SELECT * FROM users WHERE id=$1`, [customerId])
        console.log("user ",vehicle.rows[0])

        if (vehicle.rows.length === 0) {
            throw new Error("Vehicle not found");
        };

          if (user.rows.length === 0) {
            throw new Error("Customer not found");
        };

        const requestVehicle = vehicle.rows[0];

        if (requestVehicle.availability_status !== 'available') {
            throw new Error("Vehicle is already booked");
        }

        const days = calculateDays(start, end);
        if (days <= 0) {
            throw new Error("End date must be after start date");
        }

        const totalPrice = days * Number(requestVehicle.daily_rent_price);

        const bookingResult = await pool.query(`INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) VALUES ($1, $2, $3, $4, $5, 'active') RETURNING *`, [customerId, vehicleId, start, end, totalPrice]);

        await pool.query(
            `UPDATE vehicles SET availability_status = 'booked' WHERE id = $1`,
            [vehicleId]
        );


        return {
            ...bookingResult.rows[0],
            vehicle: {
                vehicle_name: requestVehicle.vehicle_name,
                daily_rent_price: requestVehicle.daily_rent_price,
            },
        };
}


const viewBookings = async (user: any) => {
  if (user.role === "admin") {
    const res = await pool.query(`
            SELECT b.*, 
            json_build_object('name', u.name, 'email', u.email) as customer,
            json_build_object('vehicle_name', v.vehicle_name, 'registration_number', v.registration_number) as vehicle
            FROM bookings b
            JOIN users u ON b.customer_id = u.id
            JOIN vehicles v ON b.vehicle_id = v.id
            `);
    return res.rows;
  } else {
    const res = await pool.query(
      `
                SELECT b.*,
                json_build_object('vehicle_name', v.vehicle_name,'registration_number', v.registration_number,'type', v.type) as vehicle
                FROM bookings b
                JOIN vehicles v ON b.vehicle_id = v.id
                WHERE b.customer_id=$1
                `,
      [user.id]
    );
    return res.rows;
  }
};




const updateBookingStatus = async (id: number, user: any, status: string) => {
  const bookingRes = await pool.query("SELECT * FROM bookings WHERE id=$1", [
    id,
  ]);

  if (bookingRes.rows.length === 0) {
    throw new Error("Booking not found");
  }

  const booking = bookingRes.rows[0];

  if (status === "cancelled") {
    if (user.role !== "customer" || booking.customer_id !== user.id) {
      throw new Error("Forbidden");
    }

    const today = new Date();
    const start = new Date(booking.rent_start_date);

    if (today >= start) {
      throw new Error("Cannot cancel after rental start date");
    }
  }

  if (status === "returned" && user.role !== "admin") {
    throw new Error("Only admin can mark as returned");
  }

  const updated = await pool.query(
    "UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *",
    [status, id]
  );

  // change vehicle status available
  if (status === "cancelled" || status === "returned") {
    await pool.query(
      "UPDATE vehicles SET availability_status='available' WHERE id=$1",
      [booking.vehicle_id]
    );
  }

  return updated.rows[0];
};




const autoReturnBookings = async () => {

  const res = await pool.query(`
    UPDATE bookings 
    SET status='returned'
    WHERE status='active' 
    AND rent_end_date < NOW()
    RETURNING *
    `);

  // Update vehicle availability
  for (const b of res.rows) {
    await pool.query(
      "UPDATE vehicles SET availability_status='available' WHERE id=$1",
      [b.vehicle_id]
    );
  }
};


export const bookingService = {
    createBooking,
    viewBookings,
    updateBookingStatus,
    autoReturnBookings,
}