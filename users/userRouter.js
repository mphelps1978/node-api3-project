
const express = require('express');

const Users = require('./userDb');
const Posts = require('../posts/postDb');

const router = express.Router();


// *** BEGIN ENDPOINT ROUTING ***

// POST User - Add user to the database
// - Passes validateUser as middleware to validate the user

router.post('/', validateUser, (req, res) => {
  Users.insert(req.body)
    .then(user => res.status(201).json(user))
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'Error adding the user' });
    });
});

// POST Article to Database by User ID
// - passes validateUserId and validatePost as middlewares to
//   validate that the information being passed is valid

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  const postInfo = { ...req.body, user_id: req.params.id };

  Posts.insert(postInfo)
    .then(post => {
      res.status(201).json(post);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'Error adding the post for the user' });
    });
});

// GET all users

router.get('/', (req, res) => {
  Users.get(req.query)
    .then(users => res.status(200).json(users))
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'Error retrieving the users' });
    });
});

// GET user by ID
// - applies validateUserId as middleware to validate the User ID

router.get('/:id', validateUserId, (req, res) => {
  Users.getById(req.params.id)
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'Error retrieving the user' });
    });
});

// GET posts by userID
// - usere validateUserId as middleware to validate that the user
//   ID is valid

router.get('/:id/posts', validateUserId, (req, res) => {
  Users.getUserPosts(req.params.id)
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'Error getting the posts for the user' });
    });
});

// DELETE - removes user from database by ID
//  - Passes validateUserId as middleware to ensure the user is in the
//  - DB

router.delete('/:id', validateUserId, (req, res) => {
  Users.remove(req.params.id)
    .then(count => {
      if (count > 0) {
        res.status(200).json({ message: 'The user has been deleted' });
      } else {
        res.status(404).json({ message: 'The user could not be found' });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'Error removing the user' });
    });
});

// PUT Users - Edits user information
//  - Passes validateUserId as middleware to validate the
//  - User ID Is valid before running the update function
//  - if the user is not in the database, return 404

router.put('/:id', validateUserId, (req, res) => {
  Users.update(req.params.id, req.body)
    .then(user => {
      if (user) {
        res.status(200).json(req.body);
      } else {
        res.status(404).json({ message: 'The user could not be found' });
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
//
//
// *** BEGIN CUSTOM MIDDLEWARE FUNCTIONS ***


// Checks to see if the user by ID is in the database

function validateUserId(req, res, next) {
  Users.getById(req.params.id)
    .then(user => {
      if (!user) {
        res.status(400).json({ message: 'Invalid user ID' });
      } else {
        req.user = req.params.id;
        next();
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'Error validating user ID' });
    });
}


// Validates that the user data being passed is in the valid format
//  - if there is no data, return 400
//  - if there is no name in the body, return 400

function validateUser(req, res, next) {
  if (!Object.keys(req.body).length) {
    res.status(400).json({ message: 'Missing user data!' });
  } else if (!req.body.name) {
    res.status(400).json({ message: 'Missing required "name" field!' });
  } else {
    next();
  }
}

// Validates post data to ensure that the data being passed is
// in the valid format
//  - If the post data is empty, return 400
//  - If the text key is missing, return 400

function validatePost(req, res, next) {
  if (!Object.keys(req.body).length) {
    res.status(400).json({ message: 'Missing post data!' });
  } else if (!req.body.text) {
    res.status(400).json({ message: 'Missing required "text" field!' });
  } else {
    next();
  }
}

// *** END CUSTOM MIDDLEWARE FUNCTIONS ***

module.exports = router;