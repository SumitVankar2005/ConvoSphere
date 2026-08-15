import httpStatus from "http-status";
import {User} from "../models/user.model.js";
import bcrypt,{hash} from "bcrypt";

import crypto from "crypto";

const login = async (req,res) => {
    const {name, username,password} = req.body;

    if(!username || !password){
        return res.status(400).json({message : "Please Provide Details"});
    }
    try{
        const user = await User.findOne({username});

        if(!user){
            return res.status(httpStatus.NOT_FOUND).json({messge: "USER NOT FOUND"});
        }

        const isMatch = await bcrypt.compare(password,user.password);

        if(isMatch){
            let token = crypto.randomBytes(20).toString("hex");

            user.token = token;
            await user.save();

            return res.status(httpStatus.OK).json({token : token,message: "User logged in"});
        }else{
            return res.status(httpStatus.UNAUTHORIZED).json({ message: "Invalid Credentials" });
        }
    } catch(e){
        return res.status(500).json({message : `SOMETHING WENT WRONG ${e}`});
    }
}

const register = async (req,res) => {
    const {name, username,password} = req.body;

    try{
        const existingUser = await User.findOne({username});
        if(existingUser){
            return res.status(http.Status.FOUND).json({message : "USER ALREADY EXISTS"});
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const newUser = new User(
            {
                name : name,
                username : username,
                password : hashedPassword
            }
        )

        await newUser.save();

        res.status(httpStatus.CREATED).json({message : "USER REGISTERED SUCCESSFULLY"});
    } catch(e) {
        return res.status(500).json({message : `SOMETHING WENT WRONG ${e}`});
    }
}

export {login,register};