/**
 *
 * @param {import("yup").ValidationError} errors
 */
function yupToJson(errors) {
  let derivedErrors = {};

  for (let error of errors.inner) {
    derivedErrors[error.path] = error.errors.join(", ");
  }

  return derivedErrors;
}

module.exports = { yupToJson };
