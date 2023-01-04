const express = require("express");
const router = express.Router();
const validateRequest = require("../functions/validation");
const database = require("../functions/database");
const Customer = require("../models/customer").model;
const Movie = require("../models/movie").model;
const Rental = require("../models/rental").model;
const rentalJoiSchema = require("../JoiSchemas/rentalSchema");

// const Fawn = require("fawn");
// const mongoose = require('mongoose');
// Fawn.init(mongoose);

router.post("/", (req, res) => {
  // Validate Request
  const validResult = validateRequest(req.body, rentalJoiSchema);
  if (validResult.error)
    return res
      .status(400)
      .send(`Error: ${validResult.error.details[0].message}.`);
  // Get movie and customer objects
  database.retrieveMany(
    [Customer, Movie],
    [req.body.customer, req.body.movie],
    ([rentalCustomer, rentalMovie]) => {
      // Check that customer and movie with the given IDs exist
      if (!rentalCustomer) return res.status(400).send("Invalid customer");
      if (!rentalMovie) return res.status(400).send("Invalid movie");
      if (rentalMovie.numberInStock === 0)
        return res.status(400).send("Movie not in stock");
      database.create(
        Rental,
        {
          customer: rentalCustomer,
          movie: rentalMovie,
        },
        (rental) => {
          // Need a transaction here to make sure both operations occur
          rentalMovie.numberInStock--;
          rentalMovie.save();
          res.send(rental);
        }
      );
    }
  );
});

// Simulate a transaction using Fawn
// try {
//   new Fawn.Task()
//     .save('rentals', rental)
//     .update('movies', { _id: movie._id }, {
//       $inc: { numberInStock: -1 }
//     })
//     .run();

//     res.send(rental);
// } catch(ex) {
//   res.status(500).send('Something failed');
// }

router.get("/", (req, res) => {
  database.retrieve(Rental, {}, (rentals) => {
    rentals.sort((a, b) => b.date - a.date);
    res.send(rentals);
  });
});

module.exports = router;
