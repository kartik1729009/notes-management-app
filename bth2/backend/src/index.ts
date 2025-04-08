import { Request, Response } from 'express';
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv';
import { dbConnect } from './config/connect';
import routes from './routes/routes'
dbConnect();
const app = express();
dotenv.config();
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true
}));
app.use(express.json());
app.get("/", (req:Request, res:Response)=>{
    res.send("this is a get route");
})
app.use("/api/v1", routes);
const PORT = process.env.PORT;
app.listen(PORT, ()=>{
    console.log(`server running successfully at port no: ${PORT}`);
})
