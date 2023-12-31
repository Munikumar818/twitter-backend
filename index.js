import express from "express";
import cors from "cors";
import { MongoClient, ServerApiVersion} from "mongodb";
const app=express();
const port=process.env.PORT || 5000;
import dotenv from "dotenv";
dotenv.config();



app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ib0ttcl.mongodb.net/?retryWrites=true&w=majority`;

// const uri = "mongodb+srv://muni818p:fJ1DS5m2tnQsK5Yh@cluster0.ib0ttcl.mongodb.net/?retryWrites=true&w=majority";
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
    await client.connect();
    // Send a ping to confirm a successful connection
    // console.log(process.env.DB_USER);
    // console.log(process.env.DB_PASS);

    const postCollection=client.db('database').collection('posts')
    const userCollection=client.db('database').collection('users');

    app.get('/post',async (req,res)=>{
        const post=(await postCollection.find().toArray()).reverse();
        res.send(post);
    });

    app.get('/userPost', async (req, res) => {
        const email = req.query.email;
        const post = (await postCollection.find({ email: email }).toArray()).reverse();
        res.send(post);
    })

    app.get('/user',async (req,res)=>{
        const user=await userCollection.find().toArray();
        res.send(user);
    })
    app.get('/loggedInUser', async (req, res) => {
        const email = req.query.email;
        const user = await userCollection.find({ email: email }).toArray();
        res.send(user);
    })
    app.post('/post',async (req,res)=>{
        const post=req.body;
        const result=await postCollection.insertOne(post);
        res.json(result);
    })

    app.post('/register',async (req,res)=>{
        const user=req.body;
        const result=await userCollection.insertOne(user);
        res.json(result);
    })

    app.patch('/userUpdates/:email',async(req,res)=>{
        const filter=req.params;
        const profile=req.body;
        const options={upsert:true};
        const updateDoc={$set: profile};
        const result =await userCollection.updateOne(filter,updateDoc,options);
        res.send(result);
    })


}catch(error){
    console.log(error);
}}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send("twitter says hi"); 
})
app.listen(port,()=>{
    console.log(`listening on port :${port}`);
});


//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } 
//   finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }