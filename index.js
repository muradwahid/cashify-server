const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("server is running");
});

async function run() {
  try {
    const uri =
      "mongodb+srv://assignment-12:assignment-12@cluster0.wk12kvv.mongodb.net/?retryWrites=true&w=majority";
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverApi: ServerApiVersion.v1,
    });
    const categoryCollection = client
      .db("assignment-12")
      .collection("category");
    const phonesCollection = client.db("assignment-12").collection("phones");
    const usersCollection = client.db("assignment-12").collection("users");
    const advertiseCollection = client.db("assignment-12").collection("advertise");
    const buyersCollection = client.db("assignment-12").collection("buyers");

    app.get("/category", async (req, res) => {
      const query = {};
      const category = await categoryCollection.find(query).toArray();
      res.send(category);
    });

    app.get("/phones/:id", async (req, res) => {
      const id = req.params.id;
      const query = { categoryId: Number(id) };
      const cursor = await phonesCollection.find(query).toArray();
      res.send(cursor);
    });
    app.post('/phones', async(req, res) => {
      const phoneData = req.body;
      const phone=await phonesCollection.insertOne(phoneData)
      res.send(phone)
    })
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await usersCollection.findOne(query)
      res.send({ isSeller: result?.role === "seller",isBuyer:result?.role==="buyer",isAdmin:result?.role==="admin" });
    })
    app.get("/verify/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await usersCollection.findOne(query)
      res.send({ isVerify: result?.verified });
    })
    app.post("/users", async (req, res) => {
      const userData = req.body;
      const user = await usersCollection.insertOne(userData);
      res.send(user)
    })
    app.put('/users/:email', async (req, res) => {
      const email = req.params.email;
      const query = {
        email:email
      }
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          role:"buyer"
        }
      }
      const result = await usersCollection.updateOne(query, updatedDoc, options)
      res.send(result)
    })
    app.put('/userverify/:email', async (req, res) => {
      const email = req.params.email;
      const query = {
        email:email
      }
      const options = { upsert: true }
      const updatedDoc = {
        $set: {
          verified:true
        }
      }
      const result = await usersCollection.updateOne(query, updatedDoc, options)
      res.send(result)
    })
    app.put('/usersrole', async (req, res) => {
      const email = req.query.email;
      let userRole = req.query.role;
      const query = {
        email:email
      }
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          role: userRole,
        },
      };
      console.log(userRole)
      const result = await usersCollection.updateOne(query, updatedDoc, options)
      res.send(result)
    })
    app.get('/myproduct/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const phones = await phonesCollection.find(query).toArray();
      res.send(phones)
    })
    app.delete('/myproduct/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const phone = await phonesCollection.deleteOne(query)
      res.send(phone)
    })
    app.get("/advertise", async (req, res) => {
      const query = {};
      const result = await advertiseCollection.find(query).toArray();
      res.send(result)
    })
    app.post('/advertise', async (req, res) => {
      const advertiseData = req.body;
      const advertise = await advertiseCollection.insertOne(advertiseData);
      res.send(advertise);
    })
    app.delete('/advertise/:id', async (req, res) => {
      const id = req.params.id;
      const query = {
        productId:id
      };
      const phone = await advertiseCollection.deleteOne(query);
      res.send(phone)
    })
    app.get('/buyers', async (req, res) => {
      const query = {
        role:"buyer"
      }
      const buyer = await usersCollection.find(query).toArray();
      res.send(buyer);
    })
    app.get('/buyers/:email', async (req, res) => {
      const email = req.params.email;
      const query = {email:email}
      const buyers = await buyersCollection.find(query).toArray();
      res.send(buyers)
    })
    app.get('/buyerorders/:email', async (req, res) => {
      const email = req.params.email;
      const query = {
        buyerEmail: email,
      };
      const buyers = await buyersCollection.find(query).toArray();
      res.send(buyers)
    })
    app.post('/buyers', async (req, res) => {
      const buyerData = req.body;
      const buyer = await buyersCollection.insertOne(buyerData);
      res.send(buyer)
    })
        app.delete("/users/:id", async (req, res) => {
          const id = req.params.id;
          const query = {
            _id:ObjectId(id)
          };
          const phone = await usersCollection.deleteOne(query);
          res.send(phone);
        });
    app.get('/sellers', async (req, res) => {
            const query = {
              role: "seller",
            };
            const seller = await usersCollection.find(query).toArray();
            res.send(seller);
    })
  } finally {
  }
}
run().catch((err) => console.log(err));
app.listen(port, () => {
  console.log(port);
});
