const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//Loading models
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");

//Validation
const validatePostInput = require("../../validation/post");

// @route   GET api/posts/test
// @desc    Test post route
// @access  Public
router.get("/test", (req, res) => {
  res.json({ msg: "Posts Works" });
});

// @route   GET api/posts/
// @desc    All Posts
// @access  Public
router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err =>
      res
        .status(404)
        .json({ nopostfound: "Posts you are finding is unavailable" })
    );
});

// @route   GET api/posts/
// @desc    All Posts
// @access  Public
router.get("/:id", (req, res) => {
  Post.findOne({ _id: req.params.id })
    .then(post => res.json(post))
    .catch(err =>
      res
        .status(404)
        .json({ nopostfound: "Post you are finding is unavailable" })
    );
});

// @route   POST api/posts/
// @desc    Create Posts
// @access  Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);
    if (!isValid) {
      // check of errors
      res.status(400).json(errors);
    }
    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });
    newPost.save().then(post => res.json(post));
  }
);

// @route   DELETE api/posts/
// @desc    Delete post
// @access  Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          // Check post owner
          if (post.user.toString() !== req.user.id) {
            return res
              .status(401)
              .json({ notauthorized: "user not authorized" });
          }

          //Delete
          post.remove().then(() => res.json({ sucess: true }));
        })
        .catch(err =>
          res
            .status(404)
            .status({ postnotfound: "Post you want to delete not found" })
        );
    });
  }
);

// @route   POST api/posts/like/:id
// @desc    like post
// @access  Private
router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          // Check if user already liked post
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length > 0
          ) {
            res
              .status(400)
              .json({ alreadyliked: "user already liked this post" });
          } else {
            // Add  user id to like array

            post.likes.unshift({ user: req.user.id });
            post.save().then(post => res.json(post));
          }
        })
        .catch(err =>
          res.status(404).status({ postnotfound: "Post not found" })
        );
    });
  }
);

// @route   POST api/posts/unlike/:id
// @desc    unlike post
// @access  Private
router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          // Check if user already liked post
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length === 0
          ) {
            res
              .status(400)
              .json({ notliked: "you have not yet liked this post" });
          } else {
            // Get remove index
            const removeIndex = post.likes
              .map(item => item.user.toString())
              .indexOf(req.user.id);

            // Splice Time
            post.likes.splice(removeIndex, 1);
            post.save().then(post => res.json(post));
          }
        })
        .catch(err =>
          res.status(404).status({ postnotfound: "Post not found" })
        );
    });
  }
);

// @route   POST api/posts/comment/:id
// @desc    add comment
// @access  Private
router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);
    if (!isValid) {
      // check of errors
      res.status(400).json(errors);
    }
    Post.findById(req.params.id).then(post => {
      newComment = {
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
      };

      // Add to comments array

      post.comments.unshift(newComment);

      //save
      post
        .save()
        .then(post => res.json(post))
        .catch(err => res.status(404).json({ posterror: "post not found" }));
    });
  }
);

// @route   Delete api/posts/comment/:id
// @desc    delete comment
// @access  Private
router.delete(
  "/comment/:id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id).then(post => {
      //Check if comment exist
      if (
        post.comments.filter(
          comment => comment._id.toString() === req.params.comment_id
        ).length === 0
      ) {
        res.status(404).json({ commentnoteexists: "Comment does not exist" });
      } else {
        const removeIndex = post.comments
          .map(item => item._id.toString())
          .indexOf(req.params.comment_id);

        //Splice time
        post.comments.splice(removeIndex, 1);
        post.save().then(post => {
          res.json(post);
        });
      }
    });
  }
);
module.exports = router;
