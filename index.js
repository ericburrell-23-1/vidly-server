const express = require('express');
const Joi = require('joi');
const app = express();

app.use(express.json());

// Array to hold genres data
let genres = [];
let nextID = 1;

// Create the Genres API
// Validation function
function validateRequest(requestBody, schema) {
    return schema.validate(requestBody);
}

// Schemas
genreSchema = Joi.object({
    name: Joi.string().required()
});

// Create route
app.post('/api/genres', (req, res) => {
    // Validate request
    const validResult = validateRequest(req.body, genreSchema);
    if (validResult.error) return res.status(400).send(`Error: ${validResult.error.details[0].message}.`);
    
    // Save new genre
    const genre = {
        id: nextID++,
        name: req.body.name
    };
    genres.push(genre);

    // Send a response
    res.send(genre);

    // Print updated array to console for testing purposes
    console.log(genres);
})

// Read routes
app.get('/api/genres', (req, res) => {
    res.send(genres);
})

app.get('/api/genres/:id', (req, res) => {
    const genre = genres.find((g => g.id === parseInt(req.params.id)));
    if (!genre) return res.status(404).send('Genre with the given ID not found');
    res.send(genre);
})

// Update route
app.put('/api/genres/:id', (req, res) => {
    const genre = genres.find((g => g.id === parseInt(req.params.id)));
    if (!genre) return res.status(404).send('Genre with the given ID not found');
    
    const validResult = validateRequest(req.body, genreSchema);
    if (validResult.error) return res.status(400).send(`Error: ${validResult.error.details[0].message}.`);

    genre.name = req.body.name;

    res.send(genre);
})

//Delete route
app.delete('/api/genres/:id', (req, res) => {
    const genre = genres.find((g => g.id === parseInt(req.params.id)));
    if (!genre) return res.status(404).send('Genre with the given ID not found');

    const index = genres.indexOf(genre);
    genres.splice(index, 1);

    res.send(genre);
})

// Activate Server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Test API at: localhost:${port}/api/genres`));