const Joi = require("joi");

// Joi Schema
movieJoiSchema = Joi.object({
  title: Joi.string().required(),
  genre: Joi.objectId().required(),
  numberInStock: Joi.number().required(),
  dailyRentalRate: Joi.number().required(),
});

module.exports = movieJoiSchema;
