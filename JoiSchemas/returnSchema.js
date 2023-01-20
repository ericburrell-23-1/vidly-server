const Joi = require("joi");

// Joi Schema
returnJoiSchema = Joi.object({
  customerId: Joi.objectId().required(),
  movieId: Joi.objectId().required(),
});

module.exports = returnJoiSchema;
