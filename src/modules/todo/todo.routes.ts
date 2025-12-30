import express  from "express";
import { todoControllers } from "./todo.controller";

const router = express.Router();

// routes -> controller -> service 

router.post("/", todoControllers.createTodo)

router.get("/", todoControllers.getTodo)

router.get("/:id", todoControllers.getSingle)

router.put("/:id", todoControllers.updateTodo)

router.delete("/:id", todoControllers.deleteTodo)

export const todoRoute = router;