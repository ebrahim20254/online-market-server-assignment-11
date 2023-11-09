const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleWere
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0aeevtm.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();


   const jobCollection = client.db('jobMaster').collection('addJob');

   const bidCollection = client.db('jobMaster').collection('bidJob');


   app.get('/jobs', async(req, res) =>{
    const cursor = jobCollection.find();
    const result = await cursor.toArray();
     res.send(result);
   })

   const newJobCollection = client.db('jobMaster').collection('newJob');

   app.get('/job', async(req, res) =>{
    const cursor = newJobCollection.find();
    const result = await cursor.toArray();
     res.send(result);
   })


   app.get('/job/:id', async(req, res) => {
    const id = req.params.id;
    const query = {_id: new ObjectId(id) }
    const result = await newJobCollection.findOne(query);
    res.send(result);
   })


    // bidJOB

    app.get('/bid', async(req, res) =>{
      console.log(req.query.email);
      let query = {};
      
      const result = await bidCollection.find(query).toArray();
      res.send(result);
    })

    app.post('/bid', async(req, res) => {
      const bid = req.body;
      console.log(bid);
      const result = await bidCollection.insertOne(bid);
      res.send(result);
    })



   app.post('/job', async(req, res) =>{
    const addJob = req.body;
    console.log(addJob);
    const result = await newJobCollection.insertOne(addJob)
     res.send(result);
   })

   app.put('/job/:id', async(req, res) =>{
    const id = req.params.id;
    const filter = {_id: new ObjectId(id)}
    const options = {upsert: true};
    const updateJob = req.body;
    const job = {
      $set: {
        email: updateJob.email,
         title: updateJob.title,
          date: updateJob.date,
           description: updateJob.description, category: updateJob.category,
            minimum: updateJob.minimum,
             maximum: updateJob.maximum
        
      }
    }
    const result = await newJobCollection.updateOne(filter, job, options);
    res.send(result);
   })



   app.delete('/job/:id', async(req, res) => {
    const id = req.params.id;
    const query = {_id: new ObjectId(id) }
    const result = await newJobCollection.deleteOne(query);
    res.send(result);
   })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) =>{
    res.send('job server is running')
})

app.listen(port, () => {
    console.log(`online job server is running on port ${port}`);
})