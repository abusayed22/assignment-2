import { Request, Response } from "express";
import { bookingService } from "./booking.service";
import { pool } from "../../../config/db";



const createBooking = async (req: Request, res: Response) => {
    try {
        const { customerId,
            vehicleId,
            startDate,
            endDate } = req.body;

        const result = await bookingService.createBooking(customerId,
            vehicleId,
            startDate,
            endDate)

        res.status(200).json({
            success: true,
            message: "Booking created successfully",
            data: result
        })

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
};


const getBookings = async (req: Request, res: Response) => {
    try {
        // Get user info from the Auth Middleware
        const user = (req as any).user; 

        // Pass ID and Role to service
        const result = await bookingService.viewBookings(user.id, user.role);

        // Customize message based on role
        const message = user.role === 'admin' 
            ? "Bookings retrieved successfully" 
            : "Your bookings retrieved successfully";

        res.status(200).json({
            success: true,
            message: message,
            data: result
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
};






const updateBookingStatus = async(req:Request,res:Response) => {
    try {
        const {status} = req.body;
        const id = req.params.bookingId
        const bookingId = Number(id)

        // const result = await bookingService.updateBookingStatus(bookingId,status);

        // res.status(200).json({
        //     success:true,
        //     message: ""
        // })

    } catch (error:any) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}


export const bookingController = {
    createBooking,
    getBookings,
    updateBookingStatus,
}
