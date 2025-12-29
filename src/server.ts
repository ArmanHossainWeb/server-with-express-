import express, { NextFunction, Request, Response } from "express"
import { Pool } from "pg"
import dotenv from "dotenv"
import path from "path"
import { error } from "console"
import { accessSync } from "fs"

dotenv.config({ path: path.join(process.cwd(), '.env') })


const app = express()
const port = 5000;
// parser 
app.use(express.json());
// app.use(express.urlencoded());

// DB 
const pool = new Pool({
  connectionString: `${process.env.CONNECTION_STR}`
})

const initDB = async () => {
  await pool.query(`
  CREATE TABLE IF NOT EXISTS  users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL, 
  email VARCHAR(150) NOT NULL,
  age INT, 
  phone VARCHAR(15),
  address TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
  )
  `)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS todos (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE , 
    title VARCHAR(200) NOT NULL , 
    description TEXT ,
    completed BOOLEAN DEFAULT false ,
    due_date DATE , 
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
    )
    `)
}


initDB();

// logger middleware 
const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}\n `)
  next()
}


app.get('/', logger, (req: Request, res: Response) => {
  res.send('Hello World!, Arman Hossain')
})

// users CRUD 
app.post("/users", async (req: Request, res: Response) => {

  const { name, email } = req.body;


  try {
    const result = await pool.query(`INSERT INTO users(name, email) VALUES($1,$2) RETURNING *`, [name, email])
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

});

app.get("/users", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM users`)
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
})

app.get("/users/:id", async (req: Request, res: Response) => {
  // console.log(req.params.id)
  try {
    const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [req.params.id])
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
})

app.put("/users/:id", async (req: Request, res: Response) => {
  // console.log(req.params.id)
  const { name, email } = req.body;
  try {
    const result = await pool.query(`UPDATE users SET name=$1 , email=$2 WHERE id=$3 RETURNING *  `, [name, email, req.params.id])
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
})

app.delete("/users/:id", async (req: Request, res: Response) => {
  // console.log(req.params.id)
  try {
    const result = await pool.query(`DELETE FROM users WHERE id = $1`, [req.params.id])
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
})


// todos CRUD
app.post("/todos", async (req: Request, res: Response) => {
  const { user_id, title } = req.body;

  try {
    const result = await pool.query(`INSERT INTO todos(user_id,title) VALUES($1,$2) RETURNING *`,[user_id,title])
    res.status(200).json({
      success:true,
      message:"todo created",
      data: result.rows[0]
    })

  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
})

app.get("/todos", async(req:Request , res:Response) =>{
  try {
    const result = await pool.query(`SELECT * FROM todos `)

    res.status(200).json({
      success: true,
      message:"todos retrived successfully",
      data: result.rows
    })
  } catch (err:any) {
    res.status(500).json({
      success:false,
      message: err.message,
      details: err
    })
  }
})

app.get("/todos/:id", async(req:Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM todos WHERE id=$1`,[req.params.id]);
    if(result.rows.length === 0){
      return res.status(400).json({error:"todo not found"})
    }
    res.json(result.rows[0])
  } catch (err:any) {
    res.status(500).json({
      error:"faild to fatch todos"
    })
  }
})

app.put("/todos/:id",async(req:Request, res:Response)=> {
  try {
    
  } catch (err:any) {
    res.status(500).json({
       
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
