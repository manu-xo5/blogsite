let mongoose = require("mongoose");

let blogSchema = new mongoose.Schema({
  title: {
    type: "String",
    required: true,
  },
  image: {
    type: Buffer,
    required: true,
    get: function (image) {
      return image.toString("base64");
    },
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
