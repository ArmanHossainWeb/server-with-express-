import express, {  Request, Response } from "express"
import config from "./config";
import initDB from "./config/db";
import logger from "./middleware/logger";
import { userRoutes } from "./modules/user/user.routes";
import { todoRoute } from "./modules/todo/todo.routes";
import { authRoutes } from "./modules/auth/auth.routes";


const app = express()

// parser 
app.use(express.json());


// inititializing db 
initDB();



app.get('/', logger, (req: Request, res: Response) => {
  res.send('Hello World!, Arman Hossain')
  
})

// users CRUD 
app.use("/users", userRoutes);


// todos CRUD
app.use("/todos", todoRoute )

// auth routes 
app.use("/auth", authRoutes)


app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
    path: req.path
  })
})

export default app;