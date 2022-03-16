let express = require("express");
let multer = require("multer");
let Blog = require("../models/blog");
let { auth } = require("../middleware");
let ImageM = require("../models/image");
let AppError = require("../lib/AppError");
let mongoose = require("mongoose");

let router = express.Router();

router.post("/new", auth, multer().single("image"), async (req, res) => {
  try {
    if (req.jwt.userType !== "admin")
      throw new AppError("Only admin can add blogs");

    let oImage = await ImageM.create({ src: req.file.buffer });
    let newBlog = await Blog.create({
      ...req.body,
      image: `/api/image/${oImage._id}`,
    });

    res.json({ newBlog });
  } catch (error) {
    if (error instanceof AppError)
      res.status(400).json({ message: error.message ?? "Error" });
    else throw error;
  }
});

router.post("/update/:blogId", multer().single("image"), async (req, res) => {
  try {
    let blogId = req.params.blogId;
    if (!blogId) throw new AppError("Blog doesn't exists");

    let blog = await Blog.findOneAndUpdate({ _id: blogId }, req.body, {
      new: true,
    }).orFail(new AppError(`Couldn't find the blog with id ${blogId}`));

    if (req.file?.buffer) {
      let image = await ImageM.create({ src: req.file.buffer });
      if (mongoose.isValidObjectId(blog.image.substring(11)))
        await ImageM.findByIdAndDelete(blog.image.substring(11));
      blog.image = `/api/image/${image._id}`;
      await blog.save();
    }

    res.json({ blog });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(400).json({ message: error.message });
    } else throw error;
  }
});

router.get("/all/raw", async (req, res) => {
  let blogs = await Blog.find();

  res.json({ blogs });
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

    let jsObject = {
      ...blog.toJSON(),
      image: blog.image.toString("base64"),
    };

    res.json({ blog: jsObject });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(400).json({ message: error.message });
    } else throw error;
  }
});

module.exports = router;
