const mongoose = require("mongoose");
const movieSchema = require("../models/movie").schema;
const customerSchema = require("../models/customer").schema;
const moment = require("moment");

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

rentalSchema.statics.lookup = function (customerId, movieId) {
  return this.findOne({
    "customer._id": customerId,
    "movie._id": movieId,
  });
};

rentalSchema.methods.return = function () {
  this.dateReturned = new Date();

  // Calculate Rental Fee
  const rentalDays = moment().diff(this.date, "days");
  this.rentalFee = rentalDays * this.movie.dailyRentalRate;
};

const Rental = mongoose.model("Rental", rentalSchema);

module.exports.Model = Rental;
module.exports.schema = rentalSchema;
