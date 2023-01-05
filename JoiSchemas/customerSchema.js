const Joi = require("joi");

// Joi Schema
customerJoiSchema = Joi.object({
  name: Joi.string().min(5).max(50).required(),
  phone: Joi.string().min(5).max(50).required(),
  isGold: Joi.bool(),
});

module.exports = customerJoiSchema;
