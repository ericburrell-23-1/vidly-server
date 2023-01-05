const mongoose = require("mongoose");

// Define a schema & model
const customerSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  phone: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  isGold: {
    type: Boolean,
    default: false,
  },
});
const Customer = mongoose.model("Customer", customerSchema);

module.exports.Model = Customer;
module.exports.schema = customerSchema;
