const db = require("./connectiondb")
const dotenv = require('dotenv')
dotenv.config()
const express = require("express");
const app = express();
app.use(express.json())
var clustering  = require('density-clustering');
const findCentroid = require('centroid2d');
const { Timestamp } = require("mongodb");
const distance = require('euclidean-distance')
var dbscan = new clustering.DBSCAN();
db.connect()

app.get("/add",async (req,res)=>{
    //await db.get().collection('test').deleteMany({})
    await db.get().collection('test').insertOne({name:"Anoop"})
    res.send("<h2>asd</h2>")
})

app.get("/read",async (req,res)=>{
    const data = await db.get().collection('test').find().toArray();
res.json(data)
})


app.post("/addfirstdata" , async(req, res)=>
{
    var obj = {}
    let id = req.body.id
    let m = await db.get().collection('test').findOne({id: id})
    if(m){
        await db.get().collection('test').updateOne({id:id},{$set:{"latitude":req.body.latitude,"longitude":req.body.longitude}})
        obj = {
        "res":"succ updated"
        }

    }else{

        await db.get().collection('test').insertOne(req.body)
        
        obj = {
            "res":"succ created"
        }
    }

    console.log('Got body:', req.body);
    
    res.json(obj);

})
app.post("/updatedataL" , async(req, res)=>
{   
    
    let id = req.body.id
    let m = await db.get().collection('test').findOne({id: id})
    var moving = false
    if(m){

        console.log(Date.now())

        if(m.latitude != req.body.latitude || m.longitude != req.body.longitude){
            moving = true 
            console.log("moving detected")
        }

        await db.get().collection('test').updateOne({id:id},{$set:{"latitude":req.body.latitude,"longitude":req.body.longitude,"accident":req.body.accident,"block":req.body.block, 
    "moving" : moving}});

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

app.get("/cluster",async (req,res)=>{
    
    const data = await db.get().collection('test').find( { moving: false } ).toArray();

    var points = new Array()
    var ids = new Array()

    data.map(element => {
        point = [element.latitude, element.longitude]
        ids.push(element.id)
        points.push(point)
        
    });

    var clusters = dbscan.run(points,0.0006,1)

    let sendData =[]
    clusters.map((cluster,ind) => 
        {
            if(cluster.length <= 1) return
            console.log("Cluster " , cluster)
            let radius = 0;
            var clusterPoints = cluster.map(index=> points[index])
            const centroid = findCentroid(clusterPoints)
            cluster.map(index=> {
                let [x,y] = points[index]
                radius = Math.max(radius,distance(centroid,[x,y]))
            })
            sendData[ind]={clusterPoints,centroid,radius}
        });
    console.log(sendData)
    res.json(sendData)

})
