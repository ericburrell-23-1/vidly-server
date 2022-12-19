const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('../functions/validation');

// Array to hold genres data
let genres = [];
let nextID = 1;

// Create the Genres API
// Schema
genreSchema = Joi.object({
    name: Joi.string().required()
});

// Create route
router.post('/', (req, res) => {
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
    //console.log(genres);
})

// Read routes
router.get('/', (req, res) => {
    res.send(genres);
})

router.get('/:id', (req, res) => {
    const genre = genres.find((g => g.id === parseInt(req.params.id)));
    if (!genre) return res.status(404).send('Genre with the given ID not found');
    res.send(genre);
})

// Update route
router.put('/:id', (req, res) => {
    const genre = genres.find((g => g.id === parseInt(req.params.id)));
    if (!genre) return res.status(404).send('Genre with the given ID not found');
    
    const validResult = validateRequest(req.body, genreSchema);
    if (validResult.error) return res.status(400).send(`Error: ${validResult.error.details[0].message}.`);

    genre.name = req.body.name;

    res.send(genre);
})

//Delete route
router.delete('/:id', (req, res) => {
    const genre = genres.find((g => g.id === parseInt(req.params.id)));
    if (!genre) return res.status(404).send('Genre with the given ID not found');

    const index = genres.indexOf(genre);
    genres.splice(index, 1);

    res.send(genre);
})

module.exports = router;