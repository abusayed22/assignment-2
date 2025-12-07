import { Router } from "express";
import { authController } from "./auth.controller";


const router = Router();

// registration
router.post("/signup",authController.createUser);
router.post("/signin",authController.loginUser);
router.get("/",authController.loginUser);





export const authRouter = router;
