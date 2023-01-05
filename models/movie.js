const mongoose = require("mongoose");
const genreSchema = require("../models/genre").schema;

// Define a schema and model
const movieSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  genre: {
    type: genreSchema,
    required: true,
  },
  numberInStock: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
  },
  dailyRentalRate: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
  },
});
const Movie = mongoose.model("Movie", movieSchema);

module.exports.Model = Movie;
module.exports.schema = movieSchema;
