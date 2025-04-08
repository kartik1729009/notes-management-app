import mongoose from 'mongoose'
import dotenv from 'dotenv';
dotenv.config();
export const dbConnect = async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL as string);
        console.log("mongodb connected successfully");
    }
    catch(err){
        console.error(err);
        console.log("some error occured: ", err);
    }
}