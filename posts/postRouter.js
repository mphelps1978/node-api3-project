const express = require('express');

const router = express.Router();
const Posts = require('./postDb')

// *** BEGIN ENDPOINT ROUTING ***

router.get('/', (req, res) => {
  Posts.get()
    .then(posts => {
      res.status(200).json(posts)
    })
    .catch(err => {
      res.status(500).json({error: 'There was an error'})
    })
});



router.get('/:id', validatePostId, (req, res) => {
  Posts.getById(req.params.id)
    .then(post => {
      if(post) {
        res.status(200).json(post)
      } else {
        res.status(404).json({error: 'Post not found'})
      }
    })
    .catch(err => {
      res.status(500).json({error: 'There was an error'})
    })
})


router.delete('/:id', validatePostId, (req, res) => {
  Posts.remove(req.params.id)
      .then(count => {
        if (count > 0) {
          res.status(200).json({ message: 'The post has been deleted' });
        } else {
          res.status(404).json({ message: 'The post could not be found' });
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ message: 'Error removing the post' });
      });
});

router.put('/:id', validatePostId, validatePost, (req, res) => {
  Posts.update(req.params.id, req.body)
    .then(post => {
      if (post) {
        res.status(200).json(req.body);
      } else {
        res.status(404).json({ message: 'The post could not be found' });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: 'Error updating the user',
      });
    });
});

// *** END ENDPOINT ROUTING ***


// *** BEGIN CUSTOM MIDDLEWARE ***

function validatePostId(req, res, next) {
  Posts.getById(req.params.id)
    .then(post => {
      if (!post) {
        res.status(400).json({ message: 'Invalid Post ID' });
      } else {
        req.post = req.params.id;
        next();
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'Error validating Post ID' });
    });
}

function validatePost(req, res, next) {
  if (!Object.keys(req.body).length) {
    res.status(400).json({ message: 'Missing post data!' });
  } else if (!req.body.text) {
    res.status(400).json({ message: 'Missing required "text" field!' });
  } else {
    next();
  }
}


module.exports = router;
