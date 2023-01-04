const { date } = require("joi");
const mongoose = require("mongoose");
const movieSchema = require("../models/movie").schema;
const customerSchema = require("../models/customer").schema;

// Define rental schema and model
const rentalSchema = mongoose.Schema({
  customer: {
    type: customerSchema,
    required: true,
  },
  movie: {
    type: movieSchema,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  dateReturned: {
    type: Date,
  },
  rentalFee: {
    type: Number,
    min: 0,
  },
});

const Rental = mongoose.model("Rental", rentalSchema);

module.exports.model = Rental;
module.exports.schema = rentalSchema;
