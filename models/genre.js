const mongoose = require("mongoose");

// Define a schema & model
const genreSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
});
const Genre = mongoose.model("Genre", genreSchema);

module.exports.Model = Genre;
module.exports.schema = genreSchema;
