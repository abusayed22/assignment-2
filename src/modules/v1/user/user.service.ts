import { Request, Response } from "express";
import { pool } from "../../../config/db";


// const getUsers = async(req:Request,res:Response) => {
//     const result = await pool.query(`SELECT * FROM users`);

//     return result;
// }


const getUsers = async () => {
  const result = await pool.query(`SELECT * FROM users`);
  return result;
};



const updateRole = async (userId: number, name?: string,email?: string,phone?: string,role?: string) => {

  const result = await pool.query(`UPDATE users SET name = COALESCE($1, name), email = COALESCE($2, email), phone = COALESCE($3, phone), role = COALESCE($4, role), updated_at = NOW() WHERE id = $5 RETURNING id, name, email, phone, role, created_at, updated_at`, [name, email, phone, role, userId]);
  return result.rows[0];
}



const deleteUser = async (userId: number) => {
  const result = await pool.query(`DELETE FROM users WHERE id = $1 RETURNING *`, [userId]);
  return result.rows[0];
}


export const userService = {
  getUsers,
  updateRole,
  deleteUser,
}
