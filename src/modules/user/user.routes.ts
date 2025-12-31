import express from "express";
import { userControllers } from "./user.controller";
import logger from "../../middleware/logger";
import auth from "../../middleware/auth";

const router = express.Router()

// routes -> controller -> service 

router.post("/", userControllers.createUser )

router.get("/",logger, auth() ,userControllers.getUser)

router.get("/:id", userControllers.getSingle)

router.put("/:id", userControllers.updateUser)

router.delete("/:id", userControllers.deleteUser)

export const userRoutes = router;