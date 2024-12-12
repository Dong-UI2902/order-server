const jwt = require("jsonwebtoken");

const argon2 = require("argon2");

const getAccessToken = (userId) => {
  return jwt.sign({ userId: userId }, process.env.ACCESS_TOKEN_SECRET);
};

const hashPassword = (password) => {
  const hash = argon2.hash(password);

  return hash;
};

const verifyHashedPassword = (password, hashed) => {
  return argon2.verify(password, hashed);
};

module.exports = {
  getAccessToken,
  hashPassword,
  verifyHashedPassword,
};
