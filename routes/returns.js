// POST /api/returns {customerId, movieId}

// Test cases
// Return 401 if client is not logged in
// Return 400 if customerId is not provided
// Return 400 if movieId is not provided
// Return 404 if no rental is found for this customer/movie
// Return 400 if rental already processed
// Return 200 if valid request
// Set the return date
// Calculate rental fee
// Increase the stock
// Return the rental summary

const moment = require("moment");
const auth = require("../functions/auth");
const express = require("express");
const router = express.Router();
const Rental = require("../models/rental").Model;
const Customer = require("../models/customer").Model;
const Movie = require("../models/movie").Model;
const returnJoiSchema = require("../JoiSchemas/returnSchema");
const validate = require("../functions/validation");

router.post("/", [auth, validate(returnJoiSchema)], async (req, res) => {
  let rental = await Rental.lookup(req.body.customerId, req.body.movieId);
  if (!rental) return res.status(404).send("Rental not found");
  if (rental.dateReturned)
    return res.status(400).send("Return already processed");

  await Movie.findByIdAndUpdate(req.body.movieId, {
    $inc: { numberInStock: 1 },
  });

  rental.return();
  await rental.save();
  res.send(rental);
});

module.exports = router;
