let express = require("express");
let { yupToJson } = require("../lib/yupHelpers");
let router = express.Router();
let User = require("../models/user");
let AppError = require("../lib/AppError");
let yup = require("yup");
let { hash, compare } = require("../lib/bcryptHelpers");
let jwt = require("jsonwebtoken");
let { auth } = require("../middleware");

let uservalidation = yup.object({
  username: yup.string().required("Username is required"),
  email: yup
    .string()
    .email("Valid email is required")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
  confirm_password: yup.string().required("Confirm password is required"),
});

router.post("/signup", async (req, res) => {
  try {
    let body = await uservalidation.validate(req.body, { abortEarly: false });

    let existingUser = await User.findOne({
      $or: [{ username: body.username }, { email: body.email }],
    });

    if (existingUser) {
      let isSameEmail = existingUser.email === body.email;
      throw new AppError(
        `User already exists with same ${isSameEmail ? "email" : "username"} `
      );
    }

    if (body.password !== body.confirm_password) {
      throw new AppError(`Confirm Password field value is not same.`);
    }

    let newUser = await User.create({
      ...body,
      userType: "user",
      password: await hash(body.password),
    });

    let jwtToken = jwt.sign(
      {
        username: newUser.username,
        email: newUser.email,
        _id: newUser._id,
        userType: newUser.userType,
      },
      process.env.JWT_SECRET
    );

    res.json({ jwtToken });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      res.status(400).json({ formErrors: yupToJson(error) });
    } else if (error instanceof AppError) {
      res.status(400).json({ message: error.message });
    } else {
      console.log(error);
      throw error;
    }
  }
});

router.post("/login", async (req, res) => {
  try {
    let body = req.body;

    let user = await User.findOne({
      username: body.username,
    });

    if (!user) {
      new AppError("Your username or password didn't matched with ours");
    }

    if (!(await compare(body.password, user.password))) {
      throw new AppError("Your username or password didn't matched with ours");
    }

    let jwtToken = jwt.sign(
      {
        username: user.username,
        email: user.email,
        _id: user._id,
        userType: user.userType,
      },
      process.env.JWT_SECRET
    );
    res.json({ jwtToken });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(400).json({ message: error.message });
    } else {
      throw error;
    }
  }
});

router.get("/me", auth, async (req, res) => {
  try {
    let id = req.jwt._id;
    let user = await User.findOne({ _id: id })
      .select("-password -confirm_password")
      .orFail(new AppError("User does not exists"));

    res.json({ user });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(400).json({
        message: error.message,
      });
    } else throw error;
  }
});

module.exports = router;
