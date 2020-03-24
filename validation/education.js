const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateEducationInput(data) {
  let errors = {};

  data.school = !isEmpty(data.school) ? data.school : "";
  data.degree = !isEmpty(data.degree) ? data.degree : "";
  data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : "";

  if (validator.isEmpty(data.school)) {
    errors.school = "Job school field is required";
  }

  if (validator.isEmpty(data.degree)) {
    errors.degree = "Job degree field is required";
  }

  if (validator.isEmpty(data.fieldofstudy)) {
    errors.fieldofstudy = "Field of study is required";
  }
  if (validator.isEmpty(data.from)) {
    errors.from = "study from field is required";
  }
  return {
    errors: errors,
    isValid: isEmpty(errors)
  };
};
