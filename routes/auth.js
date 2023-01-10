// Could be called logins.js, but auth is more common
const express = require("express");
const router = express.Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");
const validateRequest = require("../functions/validation");
const User = require("../models/user").Model;
const authJoiSchema = require("../JoiSchemas/authSchema");

router.post("/", async (req, res) => {
  const validResult = validateRequest(req.body, authJoiSchema);
  if (validResult.error)
    return res
      .status(400)
      .send(`Error: ${validResult.error.details[0].message}.`);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password.");

  // Validate password
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password.");

  // Return a JSON Web Token
  const token = user.generateAuthToken();
  res.send(token);
});

module.exports = router;
