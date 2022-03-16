const AppError = require("../lib/AppError");
const ImageM = require("../models/image");

let Router = require("express").Router();

Router.get("/:imageId", async (req, res) => {
  try {
    let imageId = req.params.imageId;
    let image = await ImageM.findById(imageId).orFail(
      new AppError("Not Found")
    );

    res.setHeader("Content-Type", "image");
    res.send(image.src);
  } catch (error) {
    if (error instanceof AppError) {
      res.sendStatus(404);
    } else throw error;
  }
});

module.exports = Router;
