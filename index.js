const db = require("./connectiondb")
const dotenv = require('dotenv')
dotenv.config()
const express = require("express");
const app = express();

db.connect()


app.get("/add",async (req,res)=>{
    await db.get().collection('test').insertOne({name:"Anoop"})
res.send("<h2>asd</h2>")
})


app.get("/read",async (req,res)=>{
    const data = await db.get().collection('test').find().toArray();
res.send(`<h2>${JSON.stringify(data)}</h2>`)
})


app.listen(3000,()=>{
    console.log("app listeing");
})
