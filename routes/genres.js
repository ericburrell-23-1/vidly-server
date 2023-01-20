const express = require("express");
const router = express.Router();
const validate = require("../functions/validation");
const auth = require("../functions/auth");
const admin = require("../functions/admin");
const database = require("../functions/database");
//const asyncMiddleWare = require("../functions/async");
const Genre = require("../models/genre").Model;
const genreJoiSchema = require("../JoiSchemas/genreSchema");
const mongoose = require("mongoose");
const validateObjectId = require("../functions/validateObjectId");

// Create the Genres API

// Create route
router.post(
  "/",
  [auth, admin, validate(genreJoiSchema)],
  /*asyncMiddleWare(*/ async (req, res) => {
    // Save new genre
    await database.create(Genre, req.body, (result) => res.send(result));
  } //)
);

// Read routes
router.get(
  "/",
  /*asyncMiddleWare(*/ async (req, res) => {
    //  throw new Error("Could not get the genres.");
    await database.retrieve(Genre, {}, (genres) => {
      res.send(genres);
    });
  } //)
);

router.get("/:id", validateObjectId, async (req, res) => {
  await database.retrieve(Genre, { _id: req.params.id }, (genre) => {
    if (!genre.length)
      return res.status(404).send("Genre with the given ID not found");
    res.send(genre);
  });
});

// Update route
router.put(
  "/:id",
  [validateObjectId, auth, admin, validate(genreJoiSchema)],
  async (req, res) => {
    await database.update(Genre, req.params.id, req.body, (genre) => {
      if (!genre)
        return res.status(404).send("Genre with the given ID not found");
      res.send(genre);
      console.log(genre);
    });
  }
);

//Delete route
router.delete("/:id", [validateObjectId, auth, admin], async (req, res) => {
  await database.remove(Genre, req.params.id, (genre) => {
    if (!genre)
      return res.status(404).send("Genre with the given ID not found");
    res.send(genre);
    console.log(genre);
  });
});

module.exports = router;
