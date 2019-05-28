const express = require("express");
const db = require("../data/db");

const router = express.Router();

router.get("/", (req, res) => {
  db.find()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(error => {
      res
        .status(500)
        .json({ error: "The posts information could not be retrieved." });
    });
});

router.get("/:id", (req, res) => {
  db.findById(req.params.id)
    .then(post => {
      if (post.length > 0) res.status(200).json(post);
      else
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
    })
    .catch(error => {
      res
        .status(500)
        .json({ error: "The comments information could not be retrieved." });
    });
});

router.post("/", async (req, res) => {
  const { title, contents } = req.body;

  if (!title || !contents) {
    res
      .status(400)
      .json({
        errorMessage: "Please provide title and contents for the post."
      });
    return;
  }

  db.insert(req.body)
    .then(async id => await db.findCommentById(id.id).then(post => res.status(201).json(post)))
    .catch(error =>
      res
        .status(500)
        .json({
          error: "There was an error while saving the post to the database"
        })
    );
});

router.get("/:id/comments", (req, res) => {
  db.findPostComments(req.params.id)
    .then(comments => {
      if (comments.length > 0) 
        res.status(200).json(comments);
      else
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
    })
    .catch(error => {
      res
        .status(500)
        .json({ errorMessage: "Please provide text for the comment." });
    });
});

router.delete("/:id", async (req, res) => {
  await db.findById(req.params.id).then(post => {
    db.remove(req.params.id)
      .then(response => {
        if (response === 0)
          res
            .status(404)
            .json({
              message: "The post with the specified ID does not exist."
            });
        else res.status(200).json({ message: post });
      })
      .catch(error => {
        res.status(500).json({ error: "The post could not be removed" });
      });
  });
});

router.put("/:id", async (req, res) => {
  const { title, contents } = req.body;

  if (!title || !contents) {
    res
      .status(400)
      .json({
        errorMessage: "Please provide title and contents for the post."
      });
    return;
  }

  db.update(req.params.id, req.body)
    .then(response => {
      if (response === 0)
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
    })
    .catch(error => {
      res
        .status(500)
        .json({ error: "The post information could not be modified." });
    });

    await db.findById(req.params.id).then(post => {
    if (post.length > 0) 
        res.status(200).json(post);
    else
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist." });
  });
});

router.post("/:id/comments", async (req, res) => {
    
    const comment = req.body.text;
    const id = req.params.id;

    if (!comment) {
      res
        .status(400)
        .json({
            errorMessage: "Please provide text for the comment." 
        });
      return;
    }
    let newID = -1;
     db.insertComment({text: comment, post_id: id})
    .then( async commentID =>  await  db.findCommentById(commentID.id).then(newComment => res.status(201).json(newComment)))
      .catch(error =>
        res
          .status(500)
          .json({
            error: "There was an error while saving the comment to the database"
          })
      );
    
      
  });

  
  module.exports = router;
