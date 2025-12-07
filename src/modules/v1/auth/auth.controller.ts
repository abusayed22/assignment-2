import { Request, Response } from "express";
import { authService } from "./auth.service";


const createUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password, phone, role } = req.body;
        const result = await authService.createUser(name,email,password,phone,role)

        res.status(201).json({
            success: true,
            message: "User registered successfully.",
            data: result.rows[0]
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}



const loginUser = async (req: Request, res: Response) => {
    try {
        const {  email, password} = req.body;

        const result = await authService.loginUser(email,password);

        res.status(200).json({
      success: true,
      message: "Login successful",
      data: {token:result.token,user:result.withoutPassword},
    });
        
    } catch (error:any) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}



const getUsers = async(req:Request,res:Response) => {
    
}





export const authController = {
    createUser,
    loginUser,
}

