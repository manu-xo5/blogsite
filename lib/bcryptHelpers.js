let bcrypt = require("bcrypt");

async function hash(str) {
  let salt = await bcrypt.genSalt();
  let hashString = await bcrypt.hash(str, salt);
  return hashString;
}

async function compare(str, hashedStr) {
  return await bcrypt.compare(str, hashedStr);
}

module.exports = { hash, compare };
