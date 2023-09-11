// servidor 
const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;

// incluyo funciones declaradas en mongodb.js
const { connectToMongodb, disconnectToMongodb} = require('./src/mongodb')
//Middleware
app.use((req, res, next) => {
    res.header("Content-Type", "application/json; charset=utf-8");
    next();
});
app.get('/', (req, res) => { res.status(200).end('¡Bienvenido a la API de ELECTRONICA !'); } );

//Endpoints
app.get('/Electronica', async (req, res) => {
    const client = await connectToMongodb();
    if (!client) {
        res.status(500).send('Error al conectarse a MongoDB')
        return;
    }
    const db = client.db('Electronica')
    const Electronica = await db.collection('Electronica').find().toArray()
    await disconnectToMongodb()
    res.json(Electronica)
});
// ```
app.get('/Electronica/:id', async (req, res) => {
    const ElectronicaID = parseInt(req.params.id) || 0
    const client = await connectToMongodb();
    if (!client) {
        res.status(500).send('Error al conectarse a MongoDB')
        return;
    }
    const db = client.db('Electronica')
    const Electronica= await db.collection('Electronica').findOne({ id: frutaID})
    await disconnectToMongodb()
    !Electronica ? res.status(404).send('No encontre la fruta con el id '+ frutaID): res.json(fruta)
});

app.get('/Electronica/nombre/:nombre', async (req, res) => {
    const nombreElectronica = req.params.nombre
    const client = await connectToMongodb();
    if (!client) {
        res.status(500).send('Error al conectarse a MongoDB')
        return;
    }
    const regex = new RegExp(nombreFruta.toLowerCase(), 'i');
    const db = client.db('Electronica')
    const Electronica = await db.collection('Electronica').find({ nombre: regex}).toArray()
    await disconnectToMongodb()
    frutas.length == 0 ? res.status(404).send('No encontre la fruta con el nombre '+ nombreFruta): res.json(frutas)
})

app.get('/Electronica /precio/:precio', async (req, res) => {
    const precioFruta = parseInt(req.params.precio) || 0
    const client = await connectToMongodb();
    if (!client) {
        res.status(500).send('Error al conectarse a MongoDB')
        return;
    }
    const db = client.db('Electronica') 
    // gte: mayor o igual a
    const Electronica = await db.collection('Electronica').find({ importe: { $gte: precioFruta } }).toArray()
    await disconnectToMongodb()
    frutas.length == 0 ? res.status(404).send('No encontre la fruta con el precio '+ precioFruta): res.json(frutas)

})

app.get("*", (req, res) => {
  res.json({
    error: "404",
    message: "No se encuentra la ruta solicitada",
  });
});

//Inicia el servidor
app.listen(PORT, () => console.log(`API de frutas escuchando en http://localhost:${PORT}`) );