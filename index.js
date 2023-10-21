const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2dhdxvg.mongodb.net/?retryWrites=true&w=majority`;

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
    const cartCollection = client.db("foodieDB").collection("cartItems");

    app.get("/products", async (req, res) => {
      const products = foodieCollection.find();
      const result = await products.toArray();
      res.send(result);
    });

    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await foodieCollection.findOne(query);
      res.send(result);
    });

    app.get("/products/brand/:brand", async (req, res) => {
      const products = req.params.brand;
      console.log(products);
      // const capitalizedProduct =
      //   products.charAt(0).toUpperCase() + products.slice(1);
      //   console.log(capitalizedProduct);
      const query = { brand: products };
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

    app.put("/products/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const option = { upsert: true };
      const updatedProduct = req.body;

      console.log(updatedProduct);

      const product = {
        $set: {
          itemName: updatedProduct.itemName,
          restaurant: updatedProduct.restaurant,
          price: updatedProduct.price,
          brand: updatedProduct.brand,
          description: updatedProduct.description,
          rating: updatedProduct.rating,
          photo: updatedProduct.photo,
        },
      };
      const result = await foodieCollection.updateOne(filter, product, option);
      res.send(result);
    });

    app.get("/cart", async (req, res) => {
      const cart = cartCollection.find();
      const result = await cart.toArray();
      res.send(result);
    });

    app.post("/cart", async (req, res) => {
      const cart = req.body;
      const result = await cartCollection.insertOne(cart);
      res.send(result);
    });

    app.delete("/cart/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(typeof id);
      const query = { _id: id };
      const result = await cartCollection.deleteOne(query);
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
