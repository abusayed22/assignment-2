import { Router } from "express";
import { vehicleController } from "./vehicle.controller";
import auth from "../../../middleware/auth";


const router = Router();


router.post("/",auth("admin"), vehicleController.addVehicle)

// get All vehicles
router.get("/", vehicleController.getAllVehicles)

// get vehicle by id
router.get("/:vehicleId", vehicleController.getVehicleById)

// update vehicle by id
router.put("/:vehicleId",auth("admin"), vehicleController.updateVehicleById)

// delete vehicle by id
router.delete("/:vehicleId",auth("admin"), vehicleController.deleteVehicleById)



export const vehicleRouter = router;
