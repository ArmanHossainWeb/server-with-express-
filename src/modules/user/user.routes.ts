import express from "express";
import { userControlers } from "./user.controller";

const router = express.Router()

// routes -> controller -> service 

router.post("/", userControlers.createUser)

router.get("/",userControlers.getUser)

router.get("/:id", userControlers.getSingle)

router.put("/:id", userControlers.updateUser)

router.delete("/:id", userControlers.deleteUser)

export const userRoutes = router;