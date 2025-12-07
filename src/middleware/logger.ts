import { NextFunction, Request, Response } from "express";


const logger = async(req:Request,res:Response,next:NextFunction) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`)
}



export default logger;
