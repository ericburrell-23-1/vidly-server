
// Validation function
function validateRequest(requestBody, schema) {
    return schema.validate(requestBody);
}

module.exports = validateRequest;