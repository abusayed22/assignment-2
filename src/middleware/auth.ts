import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextFunction, Request, Response } from "express"
import config from '../config';


const auth = (...roles: string[]) => {

    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization;
            const authToken = token?.split(' ')[1] as string
            if (!token) {
                res.status(403).json({
                    message: "Forbidden!"
                })
            }

            const decoded = jwt.verify(authToken,config.jwt_secret as string) as JwtPayload;
            (req as any).user = decoded;
            console.log(decoded)

            if (roles.length && !roles.includes(decoded.role as string)) {
                return res.status(401).json({
                    error: "Unauthorized",
                });
            }
            next()

        } catch (err: any) {
            res.status(500).json({
                success: false,
                message: err.message,
            });
        }
    }
};



export default auth;