import { Router } from "express";
import { userController } from "./user.controller";
import auth from "../../../middleware/auth";


const router = Router();


router.get("/",auth("admin"), userController.getUsers);


// update own user
router.put("/:userId",auth("admin","customer"), userController.updateRole)

// delete user
router.delete("/:userId",auth('admin'), userController.deleteUser)


export const userRouter = router;

