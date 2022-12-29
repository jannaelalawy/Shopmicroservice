require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const { mongoClient } = require("./mongo");
const port = 3000;
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const checkAvailabilty = async (db) => {
  db = await mongoClient();
  if (!db) res.status(500).send("Systems Unavailable");

  if (category.available - category.pending > 0) return true;
  else return false;
};
function checkOutOfStock() {
  //if equal zero yb2a out of stock
}

// GET ticket DONE
app.get("/api/ticket/:id", async (req, res) => {
  const db = await mongoClient();
  if (!db) res.status(500).send("Systems Unavailable");

  let ticket = await db.collection("Shop").findOne({ id: req.params.id });
  res.status(200).send(ticket);
});

// GET ALL TICKETS DONE
app.get("/api/allTickets", async (req, res) => {
  const db = await mongoClient();
  if (!db) res.status(500).send("Systems Unavailable");

  const tickets = await db.collection("Shop").find({}).toArray();
  res.status(200).send(tickets);
});

// POST MASTERLIST DONE BAS LAZEM NEGARABHA
app.post("api/masterlist", async (req, res) => {
  const db = await mongoClient();
  if (!db) res.status(500).send("Systems Unavailable");

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

// reserved decrement both

//patch pending ticket DONE BAS LAZEM NE TEST
app.patch(
  "api/pendingTicket/:matchNumber/:categoryNo/:capacity",
  async (req, res) => {
    const db = await mongoClient();
    if (!db) res.status(500).send("Systems Unavailable");
    // pending increment pending

    let matchNo = Number(req.params.matchNumber);
    const categoryNo = Number(req.params.categoryNo);
    try {
      if (categoryNo == 1) {
        db.collection("Shop").updateOne(
          {
            matchNumber: matchNo,
          },
          {
            $inc: {
              availability: {
                category1: {
                  pending: Number(req.params.capacity),
                },
              },
            },
          }
        );
      }
      // else if (categoryNo == 2) {
      //   db.collection("Shop").updateOne(
      //     { matchNumber: req.params.matchNumber },
      //     {
      //       $inc: {
      //         availability: {
      //           category2: {
      //             pending: req.params.pending,
      //           },
      //         },
      //       },
      //     }
      //   );
      // } else if (categoryNo == 3) {
      //   db.collection("Shop").updateOne(
      //     { matchNumber: req.params.matchNumber },
      //     {
      //       $inc: {
      //         availability: {
      //           category3: {
      //             pending: req.params.pending,
      //           },
      //         },
      //       },
      //     }
      //   );
      // }
    } catch (err) {
      if (err) throw err;
      console.log("error");
    }
    res.send(200);
  }
);

//PATCH RESERVE
app.patch("/api/reserve", async (req, res) => {
  let dec = Number(req.params.capacity) * -1;
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
//PATCH CANCELLED
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
  ins;
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
