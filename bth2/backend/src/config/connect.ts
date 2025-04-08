import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config();
const URL = process.env.MONGO_URL;
export const dbConnect = async () =>{
    try{
        await mongoose.connect(URL as string);
    console.log("mongodb connected successfully")
    }
    catch(err){
        console.error(err);
        console.log("some error occured while connecting to db");
        process.exit(1);
    }
}