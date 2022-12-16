require("dotenv").config();
const express = require("express");
const bodyParser = require('body-parser');
const { mongoClient } = require('./mongo');
const port = 3000
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//GET ticket
app.get( "/api/tickets/:ticket_id", async (req, res) => { 
  const db = await mongoClient();
  if (!db) res.status(500).send("Systems Unavailable");
  let ticket_id = parseInt(req.params.ticket_id);
});

///GET ALL TICKETS 
app.get('/api/allTicket', async (req,res) => {
  let db_connect = dbo.getDb("tickets");
  db_connect
    .collection("tickets")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
})

///POST ticket by id
app.post('/api/tickets', async (req,res) => {
  const db = await mongoClient();
  if (!db) res.status(500).send('Systems Unavailable');

  const newTicket = {
    name: req.body.name,
    price: req.body.price,
    quantity: 1,
    ticket_id:uuid(),
    
  };
  await db.collection('Shop').insertOne(newTicket);

  return res.send(newTicket);
});
///POST TICKET MASTERLIST 
app.post('api/masterlist', async(req,res)=>{
  let db_connect = dbo.getDb("tickets");
  //continue coding hakhod men elshop consumer w ha add at database 
    
  db_connect
  .collection("Shop")
  .find({})
  .toArray(function (err, result) {
    if (err) throw err;
    res.json(result);
  });

})
///PATCH PENDING
app.patch("/update/pending/:id", async(req,res)=>{
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.params.id) };
  //mafroud yeb2a based 3al match id fa search how hat-acces el matchid dah3shan te2alili fih el category el gayalik el count w tezawedy el pending:
  let newvalues = {
    $inc: {
      count: -req.body.count,
      pending: req.body.count, 

    },
  };
  db_connect
    .collection("tickets")
    .updateOne(myquery, newvalues, function (err, res) {
      if (err) throw err;
      console.log("1 document updated");
      response.json(res);
    });
 
 });
 ////PATCH RESERVE
 app.patch("/update/reserve/:id", async(req,res)=>{
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.params.id) };
  //mafroud yeb2a based 3al match id fa search how hat-acces el matchid dah3shan te2alili fih el category el gayalik el count w tezawedy el pending:
  let newvalues = {
    $inc: {
     // count: -req.body.count,
      pending: -req.body.count,
      //elavailability kaman ha decrement 
    },
  };
  db_connect
    .collection("tickets")
    .updateOne(myquery, newvalues, function (err, res) {
      if (err) throw err;
      console.log("1 document updated");
      response.json(res);
    });
 
 });
 /////PATCH CANCELLATION
 app.patch("/update/pending/:id", async(req,res)=>{
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.params.id) };
  //mafroud yeb2a based 3al match id fa search how hat-acces el matchid dah3shan te2alili fih el category el gayalik el count w tezawedy el pending:
  let newvalues = {
    $inc: {
      count: -req.body.count,
      pending: -req.body.count,
    },
  };
  db_connect
    .collection("tickets")
    .updateOne(myquery, newvalues, function (err, res) {
      if (err) throw err;
      console.log("1 document updated");
      response.json(res);
    });
 
 });
app.listen(port, () => {
  console.log(`App listening on port ${port}`)
});

