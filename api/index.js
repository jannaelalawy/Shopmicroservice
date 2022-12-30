require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const { mongoClient } = require("./mongo");
const { response } = require("express");
const port = 3000;
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// available > pending + el quantity
async function isPendingAvailable(matchNo, category, quantity) {
  const db = await mongoClient();
  if (!db) res.status(500).send("Systems Unavailable");
  const match = await db.collection("Shop").findOne({
    MatchNumber: matchNo,
  });

  if (
    category == 1 &&
    match.availability.category1.available >
      match.availability.category1.pending + quantity
  )
    return true;
  else if (
    category == 2 &&
    match.availability.category2.available >
      match.availability.category2.pending + quantity
  )
    return true;
  else if (
    category == 3 &&
    match.availability.category3.available >
      match.availability.category3.pending + quantity
  )
    return true;
  else return false;
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

//test
app.get("/api/test/:MatchNumber", async (req, res) => {
  const db = await mongoClient();
  if (!db) res.status(500).send("Systems Unavailable");

  const test = await db.collection("Shop").findOne({
    MatchNumber: Number(req.params.MatchNumber),
  });
  // console.log(test.availability.category1);

  res.status(200).send(test.availability.category1);
});

//patch pending ticket DONE
app.patch(
  "/pendingTicket/:matchNumber/:categoryNo/:pending",
  async (req, response) => {
    const db = await mongoClient();
    if (!db) res.status(500).send("Systems Unavailable");
    if (
      await isPendingAvailable(
        Number(req.params.matchNumber),
        Number(req.params.categoryNo),
        Number(req.params.pending)
      )
    ) {
      if (Number(req.params.categoryNo) == 1) {
        let query = { MatchNumber: Number(req.params.matchNumber) };
        let newVal = {
          $inc: {
            "availability.category1.pending": Number(req.params.pending),
          },
        };
        db.collection("Shop").updateOne(query, newVal, function (err, res) {
          if (err) throw err;
          console.log("1 document updated");
          response.json(res);
        });
      } else if (Number(req.params.categoryNo) == 2) {
        let query = { MatchNumber: Number(req.params.matchNumber) };
        let newVal = {
          $inc: {
            "availability.category2.pending": Number(req.params.pending),
          },
        };
        db.collection("Shop").updateOne(query, newVal, function (err, res) {
          if (err) throw err;
          console.log("1 document updated");
          response.json(res);
        });
      } else if (Number(req.params.categoryNo) == 3) {
        let query = { MatchNumber: Number(req.params.matchNumber) };
        let newVal = {
          $inc: {
            "availability.category3.pending": Number(req.params.pending),
          },
        };
        db.collection("Shop").updateOne(query, newVal, function (err, res) {
          if (err) throw err;
          console.log("1 document updated");
          response.json(res);
        });
      }
    } else response.send("TICKET OUT OF STOCK");
  }
);

//PATCH RESERVE DONE
app.patch(
  "/reservedTicket/:matchNumber/:categoryNo/:availability/:pending",
  async (req, response) => {
    const db = await mongoClient();
    if (!db) res.status(500).send("Systems Unavailable");

    if (Number(req.params.categoryNo) == 1) {
      let decAvailability = Number(req.params.availability) * -1;
      let decPending = Number(req.params.pending) * -1;
      let query = { MatchNumber: Number(req.params.matchNumber) };
      let newVal = {
        $inc: {
          "availability.category1.pending": decPending,
          "availability.category1.available": decAvailability,
        },
      };
      db.collection("Shop").updateOne(query, newVal, function (err, res) {
        if (err) throw err;
        console.log("1 document updated");
        response.json(res);
      });
    } else if (Number(req.params.categoryNo) == 2) {
      let decAvailability = Number(req.params.availability) * -1;
      let decPending = Number(req.params.pending) * -1;
      let query = { MatchNumber: Number(req.params.matchNumber) };
      let newVal = {
        $inc: {
          "availability.category2.pending": decPending,
          "availability.category2.available": decAvailability,
        },
      };
      db.collection("Shop").updateOne(query, newVal, function (err, res) {
        if (err) throw err;
        console.log("1 document updated");
        response.json(res);
      });
    } else if (Number(req.params.categoryNo) == 3) {
      let decAvailability = Number(req.params.availability) * -1;
      let decPending = Number(req.params.pending) * -1;
      let query = { MatchNumber: Number(req.params.matchNumber) };
      let newVal = {
        $inc: {
          "availability.category3.pending": decPending,
          "availability.category3.available": decAvailability,
        },
      };
      db.collection("Shop").updateOne(query, newVal, function (err, res) {
        if (err) throw err;
        console.log("1 document updated");
        response.json(res);
      });
    }
  }
);

//PATCH CANCELLED
app.patch(
  "/cancelledTicket/:matchNumber/:categoryNo/:pending",
  async (req, res) => {
    const db = await mongoClient();
    if (!db) res.status(500).send("Systems Unavailable");

    if (Number(req.params.categoryNo) == 1) {
      let decPending = Number(req.params.pending);
      let query = { MatchNumber: Number(req.params.matchNumber) };
      let newVal = {
        $inc: {
          "availability.category1.pending": -decPending,
        },
      };
      db.collection("Shop").updateOne(query, newVal, function (err, res) {
        if (err) throw err;
        console.log("1 document updated");
      });
    } else if (Number(req.params.categoryNo) == 2) {
      let decPending = Number(req.params.pending);
      let query = { MatchNumber: Number(req.params.matchNumber) };
      let newVal = {
        $inc: {
          "availability.category2.pending": -decPending,
        },
      };
      db.collection("Shop").updateOne(query, newVal, function (err, res) {
        if (err) throw err;
        console.log("1 document updated");
      });
    } else if (Number(req.params.categoryNo) == 3) {
      let decPending = Number(req.params.pending);
      let query = { MatchNumber: Number(req.params.matchNumber) };
      let newVal = {
        $inc: {
          "availability.category3.pending": -decPending,
        },
      };
      db.collection("Shop").updateOne(query, newVal, function (err, res) {
        if (err) throw err;
        console.log("1 document updated");
      });
    }
  }
);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
