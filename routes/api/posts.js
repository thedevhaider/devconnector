const express = require("express");
const router = express.Router();
const passport = require("passport");

//Load Model
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");

//Load Validation
const validatePostInput = require("../../validation/post");

// @routes     GET api/posts/test
// @desc       Tests posts routes
// @access     Public
router.get("/test", (req, res) => res.json({ user: "Posts Working" }));

// @routes     GET api/posts
// @desc       Get all posts
// @access     Public
router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ nopostfound: "No posts found" }));
});

// @routes     GET api/posts/id
// @desc       Get post by id
// @access     Public
router.get("/:id", (req, res) => {
  Post.findOne({ _id: req.params.id })
    .then(post => res.json(post))
    .catch(err => res.status(404).json({ nopostfound: "No post found" }));
});

// @routes     DELETE api/posts/id
// @desc       Delete post by id
// @access     Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById({ _id: req.params.id })
        .then(post => {
          //Check if user is the owner
          if (post.user.toString() !== req.user.id) {
            return res
              .status(401)
              .json({ notauthorized: "User not authorized" });
          }

          //Delete the post
          post.remove().then(() => res.json({ sucess: true }));
        })
        .catch(err => res.status(404).json({ nopostfound: "No post found" }));
    });
  }
);

// @routes     POST api/posts/like/:id
// @desc       Like post
// @access     Private
router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById({ _id: req.params.id })
        .then(post => {
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length > 0
          ) {
            return res
              .status(400)
              .json({ alreadytliked: "You have already liked this post" });
          }

          //Like the post
          post.likes.unshift({ user: req.user.id });

          //Save to db
          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ nopostfound: "No post found" }));
    });
  }
);

// @routes     POST api/posts/comment/:post_id
// @desc       Comment on a Post
// @access     Private
router.post(
  "/comment/:post_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById({ _id: req.params.post_id })
        .then(post => {
          //Validation
          const { errors, isValid } = validatePostInput(req.body);

          if (!isValid) {
            //Return with status 400 along with errors
            return res.status(400).json(errors);
          }

          const newComment = {
            text: req.body.text,
            name: req.body.name,
            avatar: req.body.avatar,
            user: req.user.id
          };

          //Add comment in the array
          post.comments.unshift(newComment);

          //Saving it to db
          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ nopostfound: "No post found" }));
    });
  }
);

// @routes     DELETE api/posts/comment/:post_id/:comment_id
// @desc       Delete a comment
// @access     Private
router.delete(
  "/comment/:post_id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById({ _id: req.params.post_id })
        .then(post => {
          //Check if the comment exists
          if (
            post.comments.filter(
              comment => comment._id.toString() === req.params.comment_id
            ).length === 0
          ) {
            return res
              .status(404)
              .json({ commentnotexist: "Comment does not exists" });
          }

          //Get index of comment
          const removeIndex = post.comments
            .map(item => item._id.toString())
            .indexOf(req.params.comment_id);

          //Check if user the owner of this comment
          if (post.comments[removeIndex].user.toString() !== req.user.id) {
            return res
              .status(401)
              .json({ notauthorized: "User not authorized" });
          }

          //Splice the comment out
          post.comments.splice(removeIndex, 1);

          //Save it to db
          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ nopostfound: "No post found" }));
    });
  }
);

// @routes     POST api/posts/unlike/:id
// @desc       Unlike post
// @access     Private
router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById({ _id: req.params.id })
        .then(post => {
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length === 0
          ) {
            return res
              .status(400)
              .json({ nottliked: "You have not liked this post" });
          }

          //Find the like index
          const removeIndex = post.likes
            .map(item => item.id)
            .indexOf(req.user.id);

          //Splicing it from the likes array
          post.likes.splice(removeIndex, 1);

          //Saving to db
          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ nopostfound: "No post found" }));
    });
  }
);

// @routes     POST api/posts
// @desc       Create Post
// @access     Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //Validation
    const { errors, isValid } = validatePostInput(req.body);

    if (!isValid) {
      //Return with status 400 along with errors
      return res.status(400).json(errors);
    }

    const newPost = new Post({
      user: req.user.id,
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar
    });

    newPost.save().then(post => res.json(post));
  }
);
module.exports = router;
