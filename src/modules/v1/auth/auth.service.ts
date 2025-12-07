import { Request, Response } from "express";
import config from "../../../config";
import { pool } from "../../../config/db";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";



const createUser = async(name:string,email:string,password:string,phone:string,role:string) => {

    const hashedPass = await bcrypt.hash(password,10);
    const result = await pool.query(`
        INSERT INTO users(name,email,password,phone,role) VALUES($1, $2 ,$3, $4, $5)`,[name,email,hashedPass,phone,role]);

        return result;
};


const loginUser = async(email:string,password:string) => {

    const result = await pool.query(`SELECT * FROM users WHERE email=$1`,[email]);

    if(result.rows.length === 0){
        throw new Error("User does not exist!");
    }

    const user =result.rows[0];
    
    const isMatch = await bcrypt.compare(password,user.password);

    if(!isMatch) {
        throw new Error("Your password not match!");
    }

    const secret = config.jwt_secret;
    const token = jwt.sign({name:user.name,email:user.email,role:user.role},secret as string,{
        expiresIn:"1d"
    })

    const {password:_,...withoutPassword} = user

    return {token,withoutPassword}
}






export const authService = {
    createUser,
    loginUser,
}

