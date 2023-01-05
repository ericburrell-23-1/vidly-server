const express = require("express");
const router = express.Router();
const validateRequest = require("../functions/validation");
const database = require("../functions/database");
const Movie = require("../models/movie").Model;
const Genre = require("../models/genre").Model;
const movieJoiSchema = require("../JoiSchemas/movieSchema");

// Create the Movies API

// Create route
router.post("/", (req, res) => {
  // Validate request
  const validResult = validateRequest(req.body, movieJoiSchema);
  if (validResult.error)
    return res
      .status(400)
      .send(`Error: ${validResult.error.details[0].message}.`);

  // Retrieve the genre for this movie
  database.retrieve(Genre, { _id: req.body.genre }, (movieGenre) => {
    // Check that genre exists
    if (!movieGenre.length) return res.status(400).send("Invalid genre");
    // Save new movie
    database.create(
      Movie,
      {
        title: req.body.title,

        genre: movieGenre[0],

        numberInStock: req.body.numberInStock,

        dailyRentalRate: req.body.dailyRentalRate,
      },
      (movie) => res.send(movie)
    );
  });
});

// Read routes
router.get("/", (req, res) => {
  database.retrieve(Movie, {}, (movies) => {
    res.send(movies);
  });
});

router.get("/:id", (req, res) => {
  console.log(typeof req.params.id);
  database.retrieve(Movie, { _id: req.params.id }, (movie) => {
    if (!movie.length)
      return res.status(404).send("Movie with the given ID not found");
    res.send(movie);
  });
});

// Update route
router.put("/:id", (req, res) => {
  const validResult = validateRequest(req.body, movieJoiSchema);
  if (validResult.error)
    return res
      .status(400)
      .send(`Error: ${validResult.error.details[0].message}.`);

  // Retrieve the genre for this movie
  database.retrieve(Genre, { _id: req.body.genre }, (movieGenre) => {
    // Save new movie
    database.update(
      Movie,
      req.params.id,
      {
        title: req.body.title,

        genre: movieGenre[0],

        numberInStock: req.body.numberInStock,

        dailyRentalRate: req.body.dailyRentalRate,
      },
      (movie) => {
        if (!movie)
          return res.status(404).send("Movie with the given ID not found");
        res.send(movie);
        console.log(movie);
      }
    );
  });
});

//Delete route
router.delete("/:id", (req, res) => {
  database.remove(Movie, req.params.id, (movie) => {
    if (!movie)
      return res.status(404).send("Movie with the given ID not found");
    res.send(movie);
    console.log(movie);
  });
});

module.exports = router;
