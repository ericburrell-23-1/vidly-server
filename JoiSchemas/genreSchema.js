const Joi = require('joi');

// Joi Schema
genreJoiSchema = Joi.object({
    name: Joi.string().required()
});

module.exports = genreJoiSchema;