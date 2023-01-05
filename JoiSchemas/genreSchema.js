const Joi = require("joi");

// Joi Schema
genreJoiSchema = Joi.object({
  name: Joi.string().min(5).max(50).required(),
});

module.exports = genreJoiSchema;
