const Joi = require('joi');

// Joi Schema
customerJoiSchema = Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().required(),
    isGold: Joi.bool()
});

module.exports = customerJoiSchema;