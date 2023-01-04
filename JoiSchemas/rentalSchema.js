const Joi = require("joi");

// Joi schema
rentalJoiSchema = Joi.object({
  customer: Joi.objectId().required(),
  movie: Joi.objectId().required(),
  date: Joi.date(),
});

module.exports = rentalJoiSchema;
