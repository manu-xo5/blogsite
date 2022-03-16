let mongoose = require("mongoose");

let blogSchema = new mongoose.Schema({
  title: {
    type: "String",
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: "String",
    required: true,
  },
  html: {
    type: "String",
    required: true,
  },
});

let Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
