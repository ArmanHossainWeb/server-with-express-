import { Request, Response } from "express";
import { todoServices } from "./todo.service";
import { pool } from "../../config/db";

const createTodo = async (req: Request, res: Response) => {
  const { user_id, title } = req.body;

  try {
    const result = await todoServices.createTodo(user_id, title)
    res.status(200).json({
      success: true,
      message: "todo created",
      data: result.rows[0]
    })

  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
}

const getTodo = async (req: Request, res: Response) => {
  try {
    const result = await todoServices.getTodo()

    res.status(200).json({
      success: true,
      message: "todos retrived successfully",
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
  try {
    const result = await todoServices.getSingle(req.params.id as string)
    if (result.rows.length === 0) {
      return res.status(400).json({ error: "todo not found" })
    }
    res.json(result.rows[0])
  } catch (err: any) {
    res.status(500).json({
      error: "faild to fatch todos"
    })
  }
}

const updateTodo =  async (req:Request, res:Response) => {
  const { title, completed } = req.body;

  try {
    const result = await todoServices.updateTodo(title, completed, req.params.id as string)

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to update todo" });
  }
}

const deleteTodo = async(req:Request, res:Response) => {
  try {
    const result = await todoServices.deleteTodo(req.params.id as string)
    if(result.rowCount === 0){
     return res.status(400).json({error:"todo not found"})
    }
    res.json({
      success:true,
      message:"todo deleted successfully",
      data: null
    })

  } catch (err:any) {
    res.status(500).json({
      error:"faild to delete todo"
    })
  }
}

export const todoControllers ={
    createTodo,
    getTodo,
    getSingle,
    updateTodo,
    deleteTodo,
    

}