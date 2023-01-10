const express = require("express");
const router = express.Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");
const database = require("../functions/database");
const validateRequest = require("../functions/validation");
const auth = require("../functions/auth");
const User = require("../models/user").Model;
const userJoiSchema = require("../JoiSchemas/userSchema");
// joi-password-complexity to enforce password requirements

router.get("/me", auth, (req, res) => {
  database.retrieve(User, { _id: req.user._id }, (user) => {
    res.send(_.omit(user[0].toObject(), ["password", "__v"]));
  });
});

router.post("/", async (req, res) => {
  const validResult = validateRequest(req.body, userJoiSchema);
  if (validResult.error)
    return res
      .status(400)
      .send(`Error: ${validResult.error.details[0].message}.`);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  // Hashing password
  const salt = await bcrypt.genSalt(10);
  req.body.password = await bcrypt.hash(req.body.password, salt);

  database.create(
    User,
    _.pick(req.body, ["name", "email", "password"]),
    (user) => {
      const token = user.generateAuthToken();
      res
        .header("x-auth-token", token)
        .send(_.pick(user, ["_id", "name", "email"]));
    }
  );
});

module.exports = router;
