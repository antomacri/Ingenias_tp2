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
        res.status(500).send('Error al conectarse a MongoDB');
        return;
    }
    const db = client.db('Ingenias');
    const Electronica = await db.collection('Electronica').find().toArray();
    await disconnectToMongodb();
    res.json(Electronica);
});

// :ID
app.put('/Electronica/:id', async (req, res) => {
    const ElectronicaID = parseInt(req.params.id) || 0;
    const nuevoDatos = req.body; 

    if (!nuevoDatos) {
        res.status(400).send('Los nuevos datos son requeridos para la actualización.');
        return;
    }

    const client = await connectToMongodb();
    if (!client) {
        res.status(500).send('Error al conectarse a MongoDB');
        return;
    }

    const db = client.db('Ingenias');
    const filtro = { id: ElectronicaID };
    const actualizacion = { $set: nuevoDatos };

    const resultado = await db.collection('Electronica').updateOne(filtro, actualizacion);
    await disconnectToMongodb();

    if (resultado.modifiedCount === 0) {
        res.status(404).send('No se encontró el producto electrónico con el ID ' + ElectronicaID);
    } else {
        res.json({ mensaje: 'Producto electrónico actualizado con éxito' });
    }
});

 // Endponit por categoria 
app.get('/Electronica/categoria/:categoria', async (req, res) => {
    const categoriaElectronica = req.params.categoria;
    const client = await connectToMongodb();
    if (!client) {
        res.status(500).send('Error al conectarse a MongoDB');
        return;
    }
    const regex = new RegExp(categoriaElectronica.toLowerCase(), 'i');
    const db = client.db('Ingenias');
    const Electronica = await db.collection('Electronica').find({ categoria: regex }).toArray();
    await disconnectToMongodb();
    Electronica.length === 0 ? res.status(404).send('No se encontraron productos electrónicos con el nombre ' + nombreElectronica) : res.json(Electronica);
});

app.get('/Electronica/nombre/:nombre', async (req, res) => {
    const nombreElectronica = req.params.nombre
    const client = await connectToMongodb();
    if (!client) {
        res.status(500).send('Error al conectarse a MongoDB')
        return;
    }
    const regex = new RegExp(nombreElectronica.toLowerCase(), 'i');
    const db = client.db('Ingenias')
    const Electronica = await db.collection('Electronica').find({ nombre: regex}).toArray()
    await disconnectToMongodb()
    Electronica.length == 0 ? res.status(404).send('No encontre del producto con el nombre '+ nombreElectronica): res.json(Electronica)
})

app.get('/Electronica/precio/:precio', async (req, res) => {
    const precioElectronica = parseInt(req.params.precio) || 0
    const client = await connectToMongodb();
    if (!client) {
        res.status(500).send('Error al conectarse a MongoDB')
        return;
    }
    const db = client.db('Ingenias') 
    // gte: mayor o igual a
    const Electronica = await db.collection('Electronica').find({ importe: { $gte: precioElectronica } }).toArray()
    await disconnectToMongodb()
    lectronica.length === 0 ? res.status(404).send('No se encontraron productos electrónicos con precio mayor o igual a ' + precioElectronica) : res.json(Electronica);

}) 
//Agregar datos
app.post('/Electronica', async (req, res) => {
    const nuevoElectronico = req.body; // Suponiendo que los datos a agregar están en el cuerpo de la solicitud.
    
    if (!nuevoElectronico) {
        res.status(400).send('Los datos del producto electrónico son requeridos.');
        return;
    }

    const client = await connectToMongodb();
    if (!client) {
        res.status(500).send('Error al conectarse a MongoDB');
        return;
    }
    
    const db = client.db('Ingenias');
    const resultado = await db.collection('Electronica').insertOne(nuevoElectronico);
    await disconnectToMongodb();

    res.json(resultado.ops[0]); // Devolver el objeto insertado con su nuevo ID.
});

app.get("*", (req, res) => {
  res.json({
    error: "404",
    message: "No se encuentra la ruta solicitada",
  });
});

//Inicia el servidor
app.listen(PORT, () => console.log(`API de Electronica escuchando en http://localhost:${PORT}`) );
