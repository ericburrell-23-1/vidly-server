const Joi = require("joi");

// Joi schema
userJoiSchema = Joi.object({
  name: Joi.string().min(5).max(50).required(),
  email: Joi.string().min(6).max(255).required().email(),
  password: Joi.string().min(7).max(1024).required(),
});

module.exports = userJoiSchema;
