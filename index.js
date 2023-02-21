const db = require("./connectiondb")
const dotenv = require('dotenv')
dotenv.config()
const express = require("express");
const app = express();
app.use(express.json())

db.connect()

app.get("/add",async (req,res)=>{
    //await db.get().collection('test').deleteMany({})
    await db.get().collection('test').insertOne({name:"Anoop"})
    res.send("<h2>asd</h2>")
})

app.get("/read",async (req,res)=>{
    const data = await db.get().collection('test').find().toArray();
res.send(`<h2>${JSON.stringify(data)}</h2>`)
})


app.post("/addfirstdata" , async(req, res)=>
{
    let id = req.body.id
    let m = db.get().collection('test').findOne({id: id})
    if(m){
        await db.get().collection('test').updateOne({id:id},{$set:{"location":req.body.location}})
    }else{
        await db.get().collection('test').insertOne(req.body)
    }
    console.log('Got body:', req.body);
    
    const obj = {
        "res":"succ"
    }
    res.json(obj);
})
app.post("/updatedataL" , async(req, res)=>
{   
    
    let id = req.body.id
    let m = db.get().collection('test').findOne({id: id})
    if(m){
        await db.get().collection('test').updateOne({id:id},{$set:{"location":req.body.location}});
        const obj = {
        "res":"succ update location"
    }
    res.json(obj);
    }else{
    
        const obj = {
        "res":"not exist"
    }
    res.json(obj);
    }
    console.log('Got body:', req.body);
    
    
    
})

app.listen(3333,()=>{
    console.log("app listeing");
})

