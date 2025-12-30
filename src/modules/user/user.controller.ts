import { Request, Response } from "express";
import { userService } from "./user.service";

const createUser = async (req: Request, res: Response) => {



    try {
        const result = await userService.createUser(req.body)
        // console.log(result.rows)
        res.status(201).json({
            success: false,
            message: "Data Inserted Successfully",
            data: result.rows[0]
        })
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }

}

const getUser =  async (req: Request, res: Response) => {
    try {
        const result = await userService.getUser();
        res.status(200).json({
            success: true,
            message: "Users retrive successfully ",
            data: result.rows
        })
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
            details: err
        })
    }
}

const getSingle = async (req: Request, res: Response) => {
  // console.log(req.params.id)
  try {
    const result = await userService.getSingle(req.params.id as string)
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "user now found"
      })
    }
    else {
      res.status(200).json({
        success: true,
        message: "User fetched successfully",
        data: result.rows[0]
      })
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
}

const updateUser =  async (req: Request, res: Response) => {
  // console.log(req.params.id)
  const { name, email } = req.body;
  try {
    const result = await userService.updateUser(name, email, req.params.id as string)
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "user now found"
      })
    }
    else {
      res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: result.rows[0]
      })
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
}

const deleteUser = async (req: Request, res: Response) => {
  // console.log(req.params.id)
  try {
    const result = await userService.deleteUser(req.params.id as string)
    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "user now found"
      })
    }
    else {
      res.status(200).json({
        success: true,
        message: "User deleted successfully",
        data: result.rows
      })
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
}

export const userControllers = {
    createUser,
    getUser,
    getSingle,
    updateUser,
    deleteUser,
}