const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const { query } = require('express');
// const { request } = require('express');
const port = process.env.PORT || 7000;


// Using MiddleWare
app.use(cors());
app.use(express.json());

// Connect
const uri = `mongodb+srv://carDbUSER:vbMD8fLuwKGYHfky@cluster0.kmnbr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// console.log(uri);
// 
async function run() {
    try {
        await client.connect();
        // console.log('database connecte');

        const database = client.db('carShop');
        const productsCollection = database.collection('products');
        const orderCollection = database.collection('order');
        console.log('database connected')


        // Get Post API
        app.post('/product', async (req, res) => {
            const product = req.body;
            const result = await productsCollection.insertOne(product);
            res.json(result);
        })

        // Get Get API
        app.get('/product', async (req, res) => {
            const cursor = productsCollection.find({});
            const productsAll = await cursor.toArray();
            res.json(productsAll);
        })

        // Get Single API 
        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const product = await productsCollection.findOne(query);
            res.json(product);
        })
        // Get Post API
        app.post('/order', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.json(result);
        });
        // Get Get API
        app.get('/order', async (req, res) => {
            const cursor = orderCollection.find({});
            const orderAll = await cursor.toArray();
            res.json(orderAll);
        }); 
        // DELETE single order API
        app.delete('/order/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.json(result);
        });


    } finally {
        // Ensures that the client will close when you finish/error
        //   await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Port No ${port} connectd`)
})