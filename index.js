const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ou6cn.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();
app.use(bodyParser.json());
app.use(cors());

const port=5000;

app.get('/', (req,res) =>{
    res.send("hello from db it's working ")
})

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
let db ;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const appointmentCollection = client.db("PrismaCenter").collection("appointments");
  // const teachersCollection = client.db("teachersInfo").collection("teacher");
  // const contactCollection = client.db("ConactInfo").collection("contact");
  // const classCollection = client.db("ClassInformation").collection("AddClass");
  
  app.post('/addAppointment', (req,res) =>{

   const appointment = req.body;
    appointmentCollection.insertOne(appointment)
        .then(result => {
            res.send(result.insertedCount > 0);
        });
   
    console.log(appointment);

  })

 console.log('Got it');
});
  
app.listen(port)
