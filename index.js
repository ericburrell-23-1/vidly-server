const express = require('express');
const app = express();
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const mongoose = require('mongoose');

// Make connection to database
mongoose.connect('mongodb://127.0.0.1:27017/mongo-exercises',
{ useNewUrlParser: true, useUnifiedTopology: true, })
    .then(() => console.log('Connected to MongoDB...'))
    .catch((err) => console.error(err.message));

app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);

// Activate Server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Test API at: localhost:${port}/api/genres`));