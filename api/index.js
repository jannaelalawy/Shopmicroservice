require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const { mongoClient } = require("./mongo");
const port = 3000;
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// GET ticket DONE
app.get("/api/ticket/:id", async (req, res) => {
  const db = await mongoClient();
  if (!db) res.status(500).send("Systems Unavailable");

  let ticket = await db.collection("Shop").findOne({ id: req.params._id });
  console.log(req.params.id);
  res.status(200).send(ticket);
});

// GET ALL TICKETS DONE
app.get("/api/allTickets", async (req, res) => {
  const db = await mongoClient();
  if (!db) res.status(500).send("Systems Unavailable");

  const tickets = await db
    .collection("Shop")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      console.log(result);
    });
  res.status(200).send(tickets);
});

// POST MASTERLIST DONE BAS LAZEM NEGARABHA
app.post("api/masterlist", async (req, res) => {
  //continue coding hakhod men elshop consumer w ha add at database
  const db = await mongoClient();
  if (!db) res.status(500).send("Systems Unavailable");
  // I have to post el masterlist fa hagebha men reservation sah?

  const masterObj = {
    matchNumber: req.body.matchNumber,
    roundNumber: req.body.roundNumber,
    dateUtc: req.body.dateUtc,
    location: req.body.location,
    availability: {
      category1: {
        available: req.body.availability.available,
        pending: req.body.availability.pending,
        price: req.body.availability.price,
      },
      category2: {
        available: req.body.availability.available,
        pending: req.body.availability.pending,
        price: req.body.availability.price,
      },
      category3: {
        available: req.body.availability.available,
        pending: req.body.availability.pending,
        price: req.body.availability.price,
      },
    },
    homeTeam: req.body.homeTeam,
    awayTeam: req.body.awayTeam,
    group: req.body.group,
  };

  await db.collection("Shop").insertOne(masterObj);

  return res.send(masterObj);
});

///POST ticket by id
app.post("/api/newTicket", async (req, res) => {
  const db = await mongoClient();
  if (!db) res.status(500).send("Systems Unavailable");

  const newTicket = {
    name: req.body.name,
    price: req.body.price,
    quantity: 1,
    ticket_id: uuid(),
  };
  await db.collection("Shop").insertOne(newTicket);

  return res.send(newTicket);
});

//POST Pending ticket
app.post("api/pending", async (req, res) => {
  //continue coding hakhod men elshop consumer w ha add at database
  const db = await mongoClient();
  if (!db) res.status(500).send("Systems Unavailable");

  const newTicket = {
    name: req.body.name,
    price: req.body.price,
    quantity: 1,
    ticket_id: uuid(),
  };
  await db.collection("Shop").insertOne(newTicket);
});

///PATCH PENDING
app.patch("/update/pending/:id", async (req, res) => {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.params.id) };

  db_connect.tickets.updateOne({
    $inc: {
      pending: req.body.count,
    },
  });

  //walla ke0daaa
  db_connect.tickets.findOne();

  let newvalues = {
    $inc: {
      //ayza lessa at2aked men elasma2 fel database
      //count: -req.body.count,
      ///ayzaa ahot condition henaa
      pending_availability: req.body.count,
      availability: req.body.count,
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
app.patch("/update/reserve/:id", async (req, res) => {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.params.id) };
  ///ala hasab el3amaltaha foo2 a3melhaa henaa kamaan
  let newvalues = {
    $inc: {
      count: -req.body.count,
      //pending: -req.body.count,
      //availability: -req.body.count,    },
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
app.patch("/update/pending/:id", async (req, res) => {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.params.id) };
  //mafroud yeb2a based 3al match id fa search how hat-acces el matchid dah3shan te2alili fih el category el gayalik el count w tezawedy el pending:
  let newvalues = {
    $inc: {
      //count: -req.body.count,
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
  console.log(`App listening on port ${port}`);
});
