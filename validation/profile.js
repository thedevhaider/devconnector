const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateProfileInput(data) {
  let errors = {};

  data.handle = !isEmpty(data.handle) ? data.handle : "";
  data.status = !isEmpty(data.status) ? data.status : "";
  data.skills = !isEmpty(data.skills) ? data.skills : "";

  if (!Validator.isLength(data.handle, { min: 2, max: 30 })) {
    errors.handle = "Handler must be 2 to 30 characters long";
  }

  if (Validator.isEmpty(data.handle)) {
    errors.handle = "Handler required";
  }

  if (Validator.isEmpty(data.status)) {
    errors.status = "Status field required";
  }

  if (Validator.isEmpty(data.skills)) {
    errors.skills = "Skills required";
  }

  if (!isEmpty(data.twitter)) {
    if (!Validator.isURL(data.twitter)) {
      errors.twitter = "Invalid Twitter url";
    }
  }

  if (!isEmpty(data.facebook)) {
    if (!Validator.isURL(data.facebook)) {
      errors.facebook = "Invalid facebook url";
    }
  }

  if (!isEmpty(data.linkedin)) {
    if (!Validator.isURL(data.linkedin)) {
      errors.linkedin = "Invalid linkedin url";
    }
  }

  if (!isEmpty(data.instagram)) {
    if (!Validator.isURL(data.instagram)) {
      errors.instagram = "Invalid instagram url";
    }
  }

  if (!isEmpty(data.youtube)) {
    if (!Validator.isURL(data.youtube)) {
      errors.youtube = "Invalid youtube url";
    }
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
