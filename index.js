const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config;
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(express.json());
app.use(cors());

// brandShop
// CYmPUhFptV3K20Ci

const uri =
  "mongodb+srv://brandShop:CYmPUhFptV3K20Ci@cluster0.2dhdxvg.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const foodieCollection = client.db("foodieDB").collection("products");

    app.get("/products", async (req, res) => {
      const products = foodieCollection.find();
      const result = await products.toArray();
      res.send(result);
    });

    app.get("/products/:type", async (req, res) => {
      const products = req.params.type;
      const capitalizedProduct =
        products.charAt(0).toUpperCase() + products.slice(1);
      const query = { type: capitalizedProduct };
      const single = foodieCollection.find(query);
      const result = await single.toArray();
      res.send(result);
    });

    app.post("/addProduct", async (req, res) => {
      const product = req.body;
      console.log(product);
      const result = await foodieCollection.insertOne(product);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Foodie server running at http://localhost:5000");
});

app.listen(port, () => {
  console.log(`foodie server listening on port ${port}`);
});
