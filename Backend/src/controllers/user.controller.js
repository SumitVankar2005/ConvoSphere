import httpStatus from "http-status";
import {User} from "../models/user.model.js";
import bcrypt,{hash} from "bcrypt";

const login = async (req,res) => {
    const {name, username,password} = req.body;

    if(!username || !password){
        return res.status(400).json({message : "Please Provide Details"});
    }
    try{
        const user = await User.find({username});

        if(!user){
            return res.status(httpStatus.NOT_FOUND).json({messge: "USER NOT FOUND"});
        }

        if(bcrypt.compare(password,user.password)){
            let token = crypto.randomBytes(20).toString("hex");

            user.token = token;
            await user.save();

            return res.status(httpStatus.OK).json({token : token});
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