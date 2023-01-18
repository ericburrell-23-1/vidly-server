const winston = require("winston");
const express = require("express");
const app = express();

require("./startup/logging")();
require("./startup/validation")();
require("./startup/routes")(app);
require("./startup/database")();
require("./startup/config")();

// Activate Server
const port = process.env.PORT || 3000;
const server = app.listen(port, () =>
  winston.info(`Test API at: localhost:${port}/api/genres`)
);

module.exports = server;
