//const db = require('./connectiondb')

async function monitorListingsUsingEventEmitter(client, timeInMs = 600000, pipeline = []){  
    const collection = client.db('test').collection('test')
    const changeStream = collection.watch(pipeline)
    changeStream.on('change',(next)=>{
        console.log(next)
    })
    await closeChangeStream(timeInMs, changeStream)

}
function closeChangeStream(timeInMs = 600000, changeStream) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("Closing the change stream");
            changeStream.close();
            resolve();
        }, timeInMs)
    })
};
module.exports = {
    monitorListingsUsingEventEmitter
};