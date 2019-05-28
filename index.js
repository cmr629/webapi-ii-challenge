const express = require('express');
const db = require('./data/db');

const port = 8000;

const server = express();

server.use(express.json());

server.get('/api/posts', (req, res) => {

    db.find()
    .then(posts => {
        res.status(200).json(posts);
    })
    .catch(error => {
        res.status(500).json({ error: "The posts information could not be retrieved."});
    });
});


server.listen(port, () => console.log(`Server stated on port ${port}`));