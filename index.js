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
        res.status(500).json({ error: "The posts information could not be retrieved." });
    });
});

server.get('/api/posts/:id', (req, res) => {
    db.findById(req.params.id)
    .then(post => {
        if (res)
            res.status(200).json(post);
        else
            res.status(404).json( {message: "The post with the specified ID does not exist."} )
    })
    .catch(error => {
        res.status(500).json({ error: "The comments information could not be retrieved." });
    });
});

server.post('/api/posts', (req, res) => {
    const { title, contents } = req.body;

    if (!title || !contents){
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
        return;
    }

    db.insert(req.body)
    .then(id => res.status(201).json(id))
    .catch(error => res.status(500).json({ error: "There was an error while saving the post to the database"  }));
});

server.get('/api/posts/:id/comments', (req, res) => {
    db.findCommentById(req.params.id)
    .then(comments => {
        if (res)
            res.status(200).json(comments);
        else
            res.status(404).json( { message: "The post with the specified ID does not exist."} )
    })
    .catch(error => {
        res.status(500).json({ errorMessage: "Please provide text for the comment."  });
    });
});

server.listen(port, () => console.log(`Server stated on port ${port}`));