import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
dotenv.config();
import {Request, Response} from 'express'
import { dbConnect } from './config/dbconnect';
import authRoutes from './routes/routes';
const app = express();
app.use(express.json());
dbConnect();
app.get('/', (req:Request, res:Response)=>{
    res.send("this is a get request by send");
    
})
app.use(cors({origin: "http://localhost:5173", credentials: true}));
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log(`server is running successfully on PORT: ${PORT}`);
})