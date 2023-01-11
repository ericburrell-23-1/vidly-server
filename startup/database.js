const mongoose = require("mongoose");
const winston = require("winston");

// Make connection to database
module.exports = function () {
  mongoose
    .set("strictQuery", true)
    .connect("mongodb://127.0.0.1:27017/vidly", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => winston.info("Connected to MongoDB..."));
};
