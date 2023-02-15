const state = {db:null}
const vr = require('./changeStream')
const { MongoClient, ServerApiVersion } = require('mongodb');



if(state.db==null){
   
}

module.exports = { 
    connect:async() => {
        const uri = process.env.CONN;
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
        await client.connect();

        state.db = client.db('test')
        console.log('connection established')
        await vr.monitorListingsUsingEventEmitter(client,600000)


    },
    get:()=>state.db
}




