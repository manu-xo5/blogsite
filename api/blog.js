let express = require("express");
let multer = require("multer");
let Blog = require("../models/blog");
let { auth } = require("../middleware");
let AppError = require("../lib/AppError");

let router = express.Router();

router.post("/new", auth, multer().single("image"), async (req, res) => {
  try {
    if (req.jwt.userType !== "admin")
      throw new AppError("Only admin can add blogs");

    let newBlog = await Blog.create({ ...req.body, image: req.file.buffer });
    res.json(newBlog);
  } catch (error) {
    if (error instanceof AppError)
      res.status(400).json({ message: error.message ?? "Error" });
    else throw error;
  }
});

router.get("/all", async (req, res) => {
  let blogs = await Blog.find();
  let allBlogs = [];

  let image;
  for (let i = 0; i < blogs.length; i++) {
    image = blogs[i].image.toString("base64");
    allBlogs.push({
      ...blogs[i].toJSON(),
      image,
    });
  }

  res.json({ blogs: allBlogs });
});

router.get("/:blogId", async (req, res) => {
  try {
    let blogId = req.params.blogId;
    let blog = await Blog.findById(blogId).orFail(
      new AppError("Blog doesn't exists")
    );

    res.json({ blog });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(400).json({ message: error.message });
    } else throw error;
  }
});

module.exports = router;
