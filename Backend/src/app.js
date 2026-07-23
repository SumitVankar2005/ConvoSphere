import express from "express";
import {createServer} from "node:http";

import { Server } from "socket.io";
import{connectToSocket} from "./controllers/socketsManager.js";

import mongoose from "mongoose";

import cors from "cors";

const app = express();
const server = createServer(app);
const io = connectToSocket(server);
app.set("port",(process.env.PORT || 8000));

app.get("/home",(req,res) => {
    res.send({"hello":"World"});
});

const start = async () => {
app.set("mongo_user")
    const connectionDb = await mongoose.connect("mongodb+srv://zeno01062025_db_user:qiHCDDKPH4P5ml8z@cluster0.hkmntkn.mongodb.net/");

    console.log(`Mongo db connected host: ${connectionDb.connection.host}`)
    server.listen(app.get("port"),() => {
        console.log("Listening to port no : 8000");
    });
}

start();