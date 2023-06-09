const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.n2l1r02.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
// mongosh "mongodb+srv://cluster0.n2l1r02.mongodb.net/myFirstDatabase" --apiVersion 1 --username doctorSania
const app = express();
app.use(bodyParser.json());
app.use(cors());

const port = 8080;

app.get("/", (req, res) => {
  res.send("hello from db it's working ");
});

// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   var dbo = db.db("PrismaCenter");
//   var myobj = { name: "Company Inc", address: "Highway 37" };
//   dbo.collection("appointments").insertOne(myobj, function(err, res) {
//     if (err) throw err;
//     console.log("1 document inserted");
//     db.close();
//   });
// });
let db;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
async function run() {
  const appointmentCollection = client
    .db("PrismaCenter")
    .collection("appointments");
  const userCollection = client.db("PrismaCenter").collection("users");

  app.post("/addAppointment", (req, res) => {
    console.log("Got it");
    const appointment = req.body;
    appointmentCollection.insertOne(appointment).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });
  app.post("/addUser", async (req, res) => {
    console.log("Got it");
    const userData = req.body;

    const email = req.body.email;
    console.log(email, "Got it email");
    const isAlready = await userCollection.findOne({ email: email });
    console.log(isAlready, "Got it email");
    if (isAlready) {
      res.send({
        isAlready: true,
        message: "User already exists",
      });
    } else {
      userCollection.insertOne(req.body).then((result) => {
        res.send({
          isAlready: false,
          data: result,
          message: "User was created successfully",
        });
      });
    }
  });
}
run().catch(console.log);
// client.connect((err) => {

//   console.log("Got it");
// });

// app.post("/addAppointment", (req, res) => {
//   console.log("Got it");
//   const appointment = req.body;
//   appointmentCollection.insertOne(appointment).then((result) => {
//     res.send(result.insertedCount > 0);
//   });
// });
// app.post("/add", (req, res) => {
//   const appointment = req.body;
//   appointmentCollection.insertOne(appointment).then((result) => {
//     res.send(result.insertedCount > 0);
//   });

//   console.log(appointment);
// });

app.listen(port);
