let mongoose = require("mongoose");

let imageSchema = new mongoose.Schema({
  src: {
    type: Buffer,
    required: true,
  },
});

let ImageM = mongoose.model("Image", imageSchema);

module.exports = ImageM;
