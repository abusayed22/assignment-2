import express, { Request, Response } from "express"
import config from "./config";
// import app from "./app";
import { authRouter } from "./modules/v1/auth/auth.router";
import initDb from "./config/db";
import { userRouter } from "./modules/v1/user/user.route";
import { vehicleRouter } from "./modules/v1/vehicle/vehicle.route";
import { bookingRouter } from "./modules/v1/booking/booking.route";


const port = config.port;

const app = express();

initDb()

app.use(express.json());

// Routes
app.use("/api/v1/auth",authRouter);
app.use("/api/v1/users",userRouter);


// Route Vehicle
app.use("/api/v1/vehicles",vehicleRouter)

// Route bookings
app.use("/api/v1/bookings",bookingRouter)




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
