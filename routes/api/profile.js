const express = require("express");
const passport = require("passport");
const mongoose = require("mongoose");
const router = express.Router();

//Load Profile Validations
const validateProfileInput = require("../../validation/profile");
const validateExperienceInput = require("../../validation/experience");
const validateEducationInput = require("../../validation/education");

//Load Profile Model
const Profile = require("../../models/Profile");

//Load User Model
const User = require("../../models/User");

// @routes     GET api/profile/test
// @desc       Tests profile routes
// @access     Public
router.get("/test", (req, res) => res.json({ user: "Profile Working" }));

// @routes     GET api/profile
// @desc       Get current user profile
// @access     Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id })
      .populate("user", ["name", "avatar"])
      .then(profile => {
        if (!profile) {
          errors.noprofile = "No profile found for this user";
          return res.status(404).json(errors);
        }
        return res.json(profile);
      })
      .catch(err => {
        return res.json(err);
      });
  }
);

// @routes     POST api/profile
// @desc       Create or Update User profile
// @access     Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //Validate Profile Fields
    const { errors, isValid } = validateProfileInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    //Get Fields
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.githubusername)
      profileFields.githubusername = req.body.githubusername;

    //Skills Split into Array
    if (typeof req.body.skills !== "undefined") {
      profileFields.skills = req.body.skills.split(',');
    }
    profileFields.skills = profileFields.skills.map(skill => skill.trim());

    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    //Search for User Profile
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (profile) {
          //Update
          //Updating
          Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: profileFields },
            { new: true }
          )
            .then(profile => {
              res.json(profile);
            })
            .catch(err => res.json(err));
        } else {
          //Create

          //Checking for Handler
          const errors = {};
          Profile.findOne({ handle: profileFields.handle })
            .then(profile => {
              if (profile) {
                errors.handle = "Handler alerady Exists";
                return res.status(400).json(errors);
              }
            })
            .catch(err => res.json(err));
          //Save Profile
          new Profile(profileFields)
            .save()
            .then(profile => {
              res.json(profile);
            })
            .catch(err => res.json(err));
        }
      })
      .catch(err => {
        res.json(err);
      });
  }
);

// @routes     GET api/profile/handle/:handle
// @desc       Get profile by handle
// @access     Public
router.get("/handle/:handle", (req, res) => {
  const errors = {};
  Profile.findOne({ handle: req.params.handle })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this handler";
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => {
      res.json(err);
    });
});

// @routes     GET api/profile/user/:user_id
// @desc       Get profile by user_id
// @access     Public
router.get("/user/:user_id", (req, res) => {
  const errors = {};
  Profile.findOne({ user: req.params.user_id })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this handler";
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => {
      res.json(err);
    });
});

// @routes     GET api/profile/all
// @desc       Get all profiles
// @access     Public
router.get("/all", (req, res) => {
  const errors = {};
  Profile.find()
    .populate("user", ["name", "avatar"])
    .then(profiles => {
      if (!profiles) {
        errors.noprofiles = "There are no profiles";
        return res.status(404).json(errors);
      }
      res.json(profiles);
    })
    .catch(err => {
      res.json(err);
    });
});

// @routes     POST api/profile/experience
// @desc       Create Experience
// @access     Private
router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //Validate Profile Fields
    const { errors, isValid } = validateExperienceInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id })
      .then(profile => {
        const newExp = {
          title: req.body.title,
          company: req.body.company,
          location: req.body.location,
          from: req.body.from,
          to: req.body.to,
          current: req.body.current,
          description: req.body.description
        };

        profile.experiences.unshift(newExp);
        profile
          .save()
          .then(profile => res.json(profile))
          .catch(err => res.json(err));
      })
      .catch(err => res.json(err));
  }
);

// @routes     POST api/profile/education
// @desc       Create Education
// @access     Private
router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //Validate Profile Fields
    const { errors, isValid } = validateEducationInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id })
      .then(profile => {
        const newEdu = {
          school: req.body.school,
          degree: req.body.degree,
          fieldofstudy: req.body.fieldofstudy,
          from: req.body.from,
          to: req.body.to,
          current: req.body.current,
          description: req.body.description
        };

        profile.education.unshift(newEdu);
        profile
          .save()
          .then(profile => res.json(profile))
          .catch(err => res.json(err));
      })
      .catch(err => res.json(err));
  }
);

// @routes     DELETE api/profile/education/edu_id
// @desc       Delete Education from profile
// @access     Private
router.delete(
  "/education/:edu_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        const removeIndex = profile.education
          .map(item => item.id)
          .indexOf(req.params.edu_id);

        profile.education.splice(removeIndex, 1);
        profile
          .save()
          .then(profile => res.json(profile))
          .catch(err => res.json(err));
      })
      .catch(err => res.json(err));
  }
);

// @routes     DELETE api/profile/experience/exp_id
// @desc       Delete Experience from profile
// @access     Private
router.delete(
  "/experience/:exp_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        const removeIndex = profile.experiences
          .map(item => item.id)
          .indexOf(req.params.exp_id);

        profile.experiences.splice(removeIndex, 1);
        profile
          .save()
          .then(profile => res.json(profile))
          .catch(err => res.json(err));
      })
      .catch(err => res.json(err));
  }
);

// @route   DELETE api/profile
// @desc    Delete user and profile
// @access  Private
router.delete(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({ user: req.user.id }).then(() => {
      User.findOneAndRemove({ _id: req.user.id }).then(() =>
        res.json({ success: true })
      );
    });
  }
);
module.exports = router;
