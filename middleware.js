let jwt = require("jsonwebtoken");

function auth(req, res, next) {
  try {
    req.jwt = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
    console.log(req.jwt);
    next();
  } catch (error) {
    if (
      error instanceof jwt.JsonWebTokenError ||
      error instanceof jwt.TokenExpiredError
    )
      res.status(401).json({ message: "Not Authorized" });
    else throw error;
  }
}

module.exports = { auth };
