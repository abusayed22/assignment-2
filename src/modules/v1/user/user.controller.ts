import { Request, Response } from "express";
import { userService } from "./user.service";


// const getUsers = async(req:Request,res:Response) => {
//     try {
//         const result = userService.getUsers;
//         res.status(200).json({
//             success:true,
//             data: result
//         })
//     } catch (error) {
//         res.status(500).json({
//             success:false,
//             message: "Internal Server Error"
//         })
//     }
// };


const getUsers = async (req: Request, res: Response) => {
  try {
    const result = await userService.getUsers();

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      datails: err,
    });
  }
};


const updateRole = async(req:Request,res:Response) => {
  try {

    const id = req.params.userId;
    const userId = Number(id);
    const { name,email,phone,role} = req.body;

    const result = await userService.updateRole(userId,name,email,phone,role);

    res.status(200).json({
      success: true,
      message:  "User updated successfully",
      data:result
    })

  } catch (err:any) {
    res.status(500).json({
      success: false,
      message: err.message,
      datails: err,
    });
  }
}


const deleteUser = async(req:Request,res:Response) => {
  try {
    const id = req.params.userId
        const userId = Number(id)
    const result = await userService.deleteUser(userId);
    res.status(200).json({
      success:true,
      message:"User deleted successfully",
    })
  } catch (err:any) {
    res.status(500).json({
      success: false,
      message: err.message,
      datails: err,
    });
  }
}


export const userController = {
    getUsers,
    updateRole,
    deleteUser,
}