import { Router } from "express";
import { bookingController } from "./booking.controller";


const router = Router();


// auto return
bookingController.returnBooking

router.post("/",bookingController.createBooking);


router.get("/",bookingController.getBookings)


router.get("/:bookingId",bookingController.updateBookingStatus)



export const bookingRouter = router;