const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validatePostInput(data) {
  let errors = {};

  data.text = !isEmpty(data.text) ? data.text : "";

  if (!Validator.isLength(data.text, { min: 10, max: 400 })) {
    errors.text = "Post must be 10 to 400 chracters long";
  }

  if (Validator.isEmpty(data.text)) {
    errors.text = "Post body required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
