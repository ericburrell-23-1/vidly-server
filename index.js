const express = require('express');
const Joi = require('joi');
const app = express();
const genres = require('./routes/genres');

app.use(express.json());
app.use('/api/genres', genres);

// Activate Server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Test API at: localhost:${port}/api/genres`));