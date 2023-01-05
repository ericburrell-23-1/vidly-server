const Joi = require("joi");

// Joi Schema
movieJoiSchema = Joi.object({
  title: Joi.string().max(100).required(),
  genre: Joi.objectId().required(),
  numberInStock: Joi.number().min(0).max(255).required(),
  dailyRentalRate: Joi.number().min(0).max(255).required(),
});

module.exports = movieJoiSchema;
