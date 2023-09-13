//Servidor
const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;
//Incluyo funciones declaradas en mongodb.js
const { connectToMongodb, disconnectToMongodb } = require('./src/mongodb');
//Middleware
app.use((req, res, next) => {
    res.header("Content-Type", "application/json; charset=utf-8");
    next();
});

app.get('/', (req, res) => {
    res.status(200).send('¡Bienvenido a la API de ELECTRÓNICA!');
});
//Endpoints
app.get('/Electronica', async (req, res) => {
    try {
        const client = await connectToMongodb();
        const db = client.db('Electronica');
        const Electronica = await db.collection('Electronica').find().toArray();
        await disconnectToMongodb();
        res.json(Electronica);
    } catch (error) {
        res.status(500).send('Error al conectarse a MongoDB: ' + error.message);
    }
});

app.get('/Electronica/:id', async (req, res) => {
    try {
        const ElectronicaID = parseInt(req.params.id) || 0;
        const client = await connectToMongodb();
        const db = client.db('Electronica');
        const Electronica = await db.collection('Electronica').findOne({ id: ElectronicaID });
        await disconnectToMongodb();
        if (!Electronica) {
            res.status(404).send('No se encontró el producto electrónico con el ID ' + ElectronicaID);
        } else {
            res.json(Electronica);
        }
    } catch (error) {
        res.status(500).send('Error al conectarse a MongoDB: ' + error.message);
    }
});

app.get('/Electronica/nombre/:nombre', async (req, res) => {
    try {
        const nombreElectronica = req.params.nombre;
        const client = await connectToMongodb();
        const db = client.db('Electronica');
        const regex = new RegExp(nombreElectronica.toLowerCase(), 'i');
        const Electronica = await db.collection('Electronica').find({ nombre: regex }).toArray();
        await disconnectToMongodb();
        if (Electronica.length === 0) {
            res.status(404).send('No se encontró ningún producto electrónico con el nombre ' + nombreElectronica);
        } else {
            res.json(Electronica);
        }
    } catch (error) {
        res.status(500).send('Error al conectarse a MongoDB: ' + error.message);
    }
});

app.get('/Electronica/precio/:precio', async (req, res) => {
    try {
        const precioElectronica = parseInt(req.params.precio) || 0;
        const client = await connectToMongodb();
        const db = client.db('Electronica');
        const Electronica = await db.collection('Electronica').find({ importe: { $gte: precioElectronica } }).toArray();
        await disconnectToMongodb();
        if (Electronica.length === 0) {
            res.status(404).send('No se encontró ningún producto electrónico con un precio mayor o igual a ' + precioElectronica);
        } else {
            res.json(Electronica);
        }
    } catch (error) {
        res.status(500).send('Error al conectarse a MongoDB: ' + error.message);
    }
});

app.get('*', (req, res) => {
    res.status(404).json({
        error: '404',
        message: 'No se encuentra la ruta solicitada',
    });
});
//Inicia el servidor
app.listen(PORT, () => console.log(`API de ELECTRÓNICA escuchando en http://localhost:${PORT}`));

//PRUEBA PUSH
