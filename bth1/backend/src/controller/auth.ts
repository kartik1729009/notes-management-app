import User from '../models/models'
import { RequestHandler, Request, Response } from 'express'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
import { Document } from 'mongoose';
dotenv.config();
interface IUser extends Document {
    email: string;
    password: string; 
}
export const createUser:RequestHandler = async(req:Request, res:Response): Promise<void> => {
    try{
        const {fullName, email, password} = req.body;
        const existingUser = await User.findOne({email});
        if(existingUser){
             res.status(400).json({
                success:false,
                message:"user already exist please login",
            });
            return;
        }
        let hashedPassword;
        try{
            hashedPassword = await bcrypt.hash(password, 10);
        }catch(err){
            res.status(500).json({
                success:false,
                message: "some error occured while hashing the password",
            });
        }
        const userInfo = await User.create({
            fullName,
            email,
            password:hashedPassword,
        });
         res.status(200).json({
            success: true,
            message:"user entry created successfully",
        });

    }
    catch(err){
        console.error(err);
         res.status(500).json({
            success:false,
            message:"can't create user entry",
            
        });
        return;
    }
}

export const login: RequestHandler = async(req:Request, res:Response): Promise<void>=> {
    try{
        const {email, password} = req.body;
    if(!email || !password){
        res.status(400).json({
            success:false,
            message:"please enter email as well as password",
        })
        return;
    }
    
    
    const user : IUser | null = await User.findOne({email});
    if(!user){
          res.status(400).json({
            success:false,
            message:"user dont exist, please create user"
        })
        return;
    }
    const payload = {
        email: user.email,
        id:user._id,
    };
    if(await bcrypt.compare(password, user.password)){
        let token = jwt.sign(payload, process.env.JWT_SECRET as string, {expiresIn: "2h"});
        const options = {
            expires: new Date(Date.now()+2*60*60),
            httpOnly: true,
        }
        if (res.headersSent) { 
    return; 
}
        res.cookie("token1", token, options);
        res.status(200).json({ 
        success: true,
        token,
        user,
        message: "Login successful", 
    });

    return;

        
    }
    else{
         res.status(403).json({
            success: false,
            message: "password incorrect",
        });
    }
    return;


    }
    catch(err){
        console.error(err);
         res.status(500).json({
            success: false,
            message:"internal server error",
        });
        return;
    }
    
}


