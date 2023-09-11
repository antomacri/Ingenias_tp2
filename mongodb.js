const dotenv = require ('dotenv');
const { MongoClient } = require('mongodb');
dotenv.config()
//Config Db

const URL = process.env.MONGODB_URLSTRING 
const cliente = new MongoClient (URL)

async function connectToMongodb( ) {
    try {
        await cliente.connect
        console.log ('connected to mongoDB')
        return cliente
    
    } catch (error){
        console.log('Error connecting to mongoDB:' + error)
        return null 

    }
}
//convencional 
const disconnectToMongodb = async () => {
    try {
        await cliente.connect
        console.log ('Disconnect to mongoDB')
        return cliente
    // arrow functions
    } catch (error){
        console.log('Error to disconnet mongoDB:' + error)
       

    }
}
module.exports = { connectToMongodb , disconnectToMongodb}