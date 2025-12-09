import express, { Request, Response } from "express"
import initDb from "./config/db";
import { authRouter } from "./modules/v1/auth/auth.router";
import { userRouter } from "./modules/v1/user/user.route";
import { vehicleRouter } from "./modules/v1/vehicle/vehicle.route";
import { bookingRouter } from "./modules/v1/booking/booking.route";


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



app.get('/', (req:Request, res:Response) => {
  res.status(200).json({
    message:"paysi"
  })
});



app.use(express.json());


// Routes
// app.use("/api/v1/auth",authRouter);





// Database sync
initDb()

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});


export default app;
