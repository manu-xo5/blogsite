let mongoose = require("mongoose");

let userSchema = new mongoose.Schema({
  email: {
    type: "String",
    required: true,
  },
  username: {
    type: "String",
    required: true,
  },
  password: {
    type: "String",
    required: true,
  },
  confirm_password: {
    type: "String",
    required: true,
  },
  userType: {
    type: "String",
    required: true,
  },
});

let User = mongoose.model("User", userSchema);

module.exports = User;
