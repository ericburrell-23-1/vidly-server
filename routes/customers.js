const express = require("express");
const router = express.Router();
const validate = require("../functions/validation");
const database = require("../functions/database");
const Customer = require("../models/customer").Model;
const customerJoiSchema = require("../JoiSchemas/customerSchema");

// Create the Genres API

// Create route
router.post("/", validate(customerJoiSchema), (req, res) => {
  // Save new genre
  database.create(Customer, req.body, (result) => res.send(result));
});

// Read routes
router.get("/", (req, res) => {
  database.retrieve(Customer, {}, (customers) => {
    res.send(customers);
  });
});

router.get("/:id", (req, res) => {
  database.retrieve(Customer, { _id: req.params.id }, (customer) => {
    if (!customer.length)
      return res.status(404).send("Customer with the given ID not found");
    res.send(customer);
  });
});

// Update route
router.put("/:id", validate(customerJoiSchema), (req, res) => {
  database.update(Customer, req.params.id, req.body, (customer) => {
    if (!customer)
      return res.status(404).send("Customer with the given ID not found");
    res.send(customer);
    console.log(customer);
  });
});

//Delete route
router.delete("/:id", (req, res) => {
  database.remove(Customer, req.params.id, (customer) => {
    if (!customer)
      return res.status(404).send("Customer with the given ID not found");
    res.send(customer);
    console.log(customer);
  });
});

module.exports = router;
