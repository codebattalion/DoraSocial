const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validatePostInput(data) {
  let errors = {};

  data.text = !isEmpty(data.text) ? data.text : "";

  if (!validator.isLength(data.text, { min: 10, max: 300 })) {
    errors.handle = "Post must be between 10 and 300 words";
  }
  if (validator.isEmpty(data.text)) {
    errors.text = "text field is required";
  }

  return {
    errors: errors,
    isValid: isEmpty(errors)
  };
};
