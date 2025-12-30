import express, {  Request, Response } from "express"
import config from "./config";
import initDB, { pool } from "./config/db";
import logger from "./middleware/logger";
import { userRoutes } from "./modules/user/user.routes";


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
app.use("/todos",  )

app.post("/todos", async (req: Request, res: Response) => {
  const { user_id, title } = req.body;

  try {
    const result = await pool.query(`INSERT INTO todos(user_id,title) VALUES($1,$2) RETURNING *`, [user_id, title])
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
})

app.get("/todos", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM todos `)

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
})

app.get("/todos/:id", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM todos WHERE id=$1`, [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: "todo not found" })
    }
    res.json(result.rows[0])
  } catch (err: any) {
    res.status(500).json({
      error: "faild to fatch todos"
    })
  }
})

app.put("/todos/:id", async (req, res) => {
  const { title, completed } = req.body;

  try {
    const result = await pool.query(
      "UPDATE todos SET title=$1, completed=$2 WHERE id=$3 RETURNING *",
      [title, completed, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to update todo" });
  }
});

app.delete("/todos/:id", async(req:Request, res:Response) => {
  try {
    const result = await pool.query("DELETE FROM todos WHERE id=$1 RETURNING *",[req.params.id])
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
})




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
