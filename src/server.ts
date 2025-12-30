import express, {  Request, Response } from "express"
import config from "./config";
import initDB, { pool } from "./config/db";
import logger from "./middleware/logger";
import { userRoutes } from "./modules/user/user.routes";
import { todoRoute } from "./modules/todo/todo.routes";


const app = express()
const port = config.port;
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




app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
    path: req.path
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
