// Validation function
// function validateRequest(requestBody, schema) {
//   return schema.validate(requestBody);
// }

const validate = (schema) => {
  return (req, res, next) => {
    const validResult = schema.validate(req.body);
    if (validResult.error)
      return res
        .status(400)
        .send(`Error: ${validResult.error.details[0].message}.`);
    next();
  };
};

module.exports = validate;
