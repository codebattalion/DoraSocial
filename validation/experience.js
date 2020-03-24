const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateExperienceInput(data) {
  let errors = {};

  data.title = !isEmpty(data.title) ? data.title : "";
  data.company = !isEmpty(data.company) ? data.company : "";
  data.from = !isEmpty(data.from) ? data.from : "";
  data.company = !isEmpty(data.company) ? data.company : "";

  if (validator.isEmpty(data.title)) {
    errors.title = "Job title field is required";
  }

  if (validator.isEmpty(data.company)) {
    errors.company = "Job company field is required";
  }

  if (validator.isEmpty(data.from)) {
    errors.from = "Job from field is required";
  }

  return {
    errors: errors,
    isValid: isEmpty(errors)
  };
};
