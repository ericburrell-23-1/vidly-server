const express = require('express');
const router = express.Router();
const validateRequest = require('../functions/validation');
const database = require('../functions/database');
const Genre = require('../models/genre');
const genreJoiSchema = require('../JoiSchemas/genreSchema');

// Create the Genres API

// Create route
router.post('/', (req, res) => {
    // Validate request
    const validResult = validateRequest(req.body, genreJoiSchema);
    if (validResult.error) return res.status(400).send(`Error: ${validResult.error.details[0].message}.`);
    
    // Save new genre
    database.create(Genre, req.body, (result) => res.send(result));
})

// Read routes
router.get('/', (req, res) => {
    database.retrieve(Genre, {}, (genres) => {
        res.send(genres);
    });
})

router.get('/:id', (req, res) => {
    database.retrieve(Genre, { _id: req.params.id }, (genre) => {
        if (!genre.length) return res.status(404).send('Genre with the given ID not found');
        res.send(genre);
    })
})

// Update route
router.put('/:id', (req, res) => {
    const validResult = validateRequest(req.body, genreJoiSchema);
    if (validResult.error) return res.status(400).send(`Error: ${validResult.error.details[0].message}.`);

    database.update(Genre, req.params.id, req.body, (genre) => {
        if (!genre) return res.status(404).send('Genre with the given ID not found');
        res.send(genre);
        console.log(genre);
    })
})

//Delete route
router.delete('/:id', (req, res) => {
    database.remove(Genre, req.params.id, (genre) => {
        if (!genre) return res.status(404).send('Genre with the given ID not found');
        res.send(genre);
        console.log(genre);
    })
})

module.exports = router;