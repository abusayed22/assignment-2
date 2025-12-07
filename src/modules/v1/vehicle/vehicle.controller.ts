import { Request, Response } from "express"
import { vehicleService } from "./vehicle.service";



const addVehicle = async (req: Request, res: Response) => {
    try {
        const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = req.body;
        const result = await vehicleService.addVehicle(vehicle_name, type, registration_number, daily_rent_price, availability_status);
        console.log(result)
        res.status(201).json({
            success: true,
            message: "Vehicle created successfully",
            data: result
        })

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}


const getAllVehicles = async (req: Request, res: Response) => {
    try {
        const result = await vehicleService.getAllVehicles()

        res.status(200).json({
            success: true,
            message: "Vehicles retrieved successfully",
            data: result
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}


const getVehicleById = async (req: Request, res: Response) => {
    try {
        const id = req.params.vehicleId
        const vehicleId = Number(id)
        const result = await vehicleService.getVehicleById(vehicleId)

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Vehicle not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Vehicle retrieved successfully",
            data: result
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

const updateVehicleById = async (req: Request, res: Response) => {
    try {
        const id = req.params.vehicleId
        const vehicleId = Number(id)
        const { vehicle_name, type, registration_number,
            daily_rent_price, availability_status } = req.body;

        const result = await vehicleService.updateVehicleById(vehicleId, vehicle_name, type, registration_number,
            daily_rent_price, availability_status);
            

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Vehicle not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Vehicle updated successfully",
            data: result
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

const deleteVehicleById = async (req: Request, res: Response) => {
    try {
        const id = req.params.vehicleId
        const vehicleId = Number(id)

        const result = await vehicleService.deleteVehicleById(vehicleId);
            

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Vehicle not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Vehicle deleted successfully",
            data: result
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}



export const vehicleController = {
    addVehicle,
    getAllVehicles,
    getVehicleById,
    updateVehicleById,
    deleteVehicleById,
}
