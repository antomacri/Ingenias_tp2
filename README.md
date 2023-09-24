# Ingenias_tp2
# Documentación de productos electrónicos


### Indice de contenidos 

- [Documentación de productos electrónicos](#documentación-de-productos-electrónicos)
    - [Indice de contenidos](#indice-de-contenidos)
    - [Integrantes](#integrantes)
    - [URL de la API](#url-de-la-api)
    - [Repositorio](#repositorio)
    - [Base de datos](#base-de-datos)
    - [Pasos para ejecutar la API](#pasos-para-ejecutar-la-api)
  - [Listado de Endpoints](#listado-de-endpoints)
    - [Ejemplo de Bloques de código utilizados](#ejemplo-de-bloques-de-código-utilizados)
      - [Método GET](#método-get)
      - [Método PUT](#método-put)
      - [Método POST](#método-post)
      - [Método DELETE](#método-delete)
  - [Gráfico funcionamiento de la API](#gráfico-funcionamiento-de-la-api)

### Integrantes 
- Antonella Macri
- Ludmila Kuszñir Ramella
- Camila Martinez Alvarez
- Valentina Wiehl


### URL de la API
```
(http://localhost:4000/Electronica)
```

### Repositorio
```
https://github.com/antomacri/Ingenias_tp2/tree/main
```
### Base de datos
```
mongodb+srv://ingenias2:1234@admin.ebgrehp.mongodb.net/?retryWrites=true&w=majority
```

### Pasos para ejecutar la API

1. Abrir la terminal en VSC
2. Instalar los paquetes con el comando npm i express mongodb nodemon dotenv
3. Escribir en la terminar el comando git init
4. Escribir el comando git clone https://github.com/antomacri/Ingenias_tp2/tree/main
5. Conectarse a la base de datos de mongoDB ingresando el siguiente URL para la conexión:
   -  mongodb+srv://ingenias2:1234@admin.ebgrehp.mongodb.net/?retryWrites=true&w=majority
6. Escribir el comando npm run start en la terminal
7. Realizar las consultas de los endpoints utilizando los URL detallados en el punto siguiente.
   
   

## Listado de Endpoints
| PETICION | URL | DESCRIPCION 
|:--:|:--:|:-----:|
|GET| [/Electronica](http://localhost:4000/Electronica)| Retorna todos los datos de los productos |
|GET|  [/Electronica/id](http://localhost:4000/Electronica/:id) | Retorna los datos de los productos de acuerdo al ID ingresado |
|GET| [/Electronica/nombre](http://localhost:4000/Electronica/nombre/:nombre) | Retorna los datos de los productos según el nombre ingresado |
|GET| [/Electronica/categoria](http://localhost:4000/Electronica/categoria/:categoria) | Retorna los productos que se encuentren en la categoria ingresada |
|GET| [/Electronica/precio](http://localhost:4000/Electronica/precio/:precio) | Retorna los productos que tengan el precio mayor o igual al ingresado |
|POST|[/Electronica](http://localhost:4000/Electronica)| Agrega un nuevo producto a la base de datos|
|PUT|[/Electronica/id](http://localhost:4000/Electronica/:id) | Actualiza los datos del producto seleccionado
|DELETE|[/Electronica/id](http://localhost:4000/Electronica/:id) | Elimina el producto seleccionado según su ID.

### Ejemplo de Bloques de código utilizados

```javascript
{
  "_id": {
    "$oid": "64fd300853568848111defc6"
  },
  "codigo": 6,
  "nombre": "Proyector HD",
  "precio": 499.99,
  "categoria": "Video"
}
```
#### Método GET

Se utiliza el método GET para que la API nos retorne información de acuerdo a lo que se necesite. En este caso, retorna toda la información de los productos electrónicos, existentes en la base de datos.

```javascript

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

```
#### Método PUT

Se utiliza el método PUT para que la API nos permita actualizar los datos de un producto especifico seleccionado.

```javascript

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
```
#### Método POST

Se utiliza el método POST para que la API nos permita agregar nuevos productos a la base de datos.

```javascript
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
```
#### Método DELETE

Se utiliza el método DELETE para que la API nos permita eliminar productos a la base de datos.

```javascript

app.delete('/Electronica/:codigo', async (req, res) => { 
    const codigo = req.params.codigo;
    if (!codigo) {
        res.status(400).send('Error en el formato del id recibido')
    }
    const client = await connectToMongodb();
    if (!client) {
        res.status(500).send('Error al conectarse a MongoDB')
        return;
    }
    client.connect()
        .then(() => { 
            const collection = client.db('Ingenias').collection('Electronica')
            return collection.deleteOne({codigo: parseInt(codigo)})
        }).then((resultado) => {
            if (resultado.deletedCount === 0) {
                res.status(404).send('No se pudo encontrar un producto con id: '+codigo)
            } else {
                console.log('Producto eliminado')
                res.status(204).send('Producto eliminado')
            }
        }).catch((err) => {
            console.error(err)
             res.status(500).send('Error al eliminar el producto')
        }).finally(() => {
            client.close()
        })
})

```
## Gráfico funcionamiento de la API

```mermaid
graph TD;
    API-->DATABASE;
    DATABASE-->REQUEST;
    REQUEST-->GET;
    REQUEST-->PUT;
    REQUEST-->POST;
    REQUEST-->DELETE;



```
