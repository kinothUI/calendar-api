const jwt = require("jsonwebtoken");

require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

const generateJWT = async (user, timeout) => {
  const { id, email, admin, name, surname } = user;
  return new Promise((resolve, reject) => {
    const userData = { id: id.toString(), email, admin, name, surname };

    jwt.sign(userData, JWT_SECRET, { expiresIn: timeout }, (error, token) =>
      !error ? resolve({ token }) : reject(err)
    );
  });
};

const verifyJWT = async (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (error, decoded) => (!error ? resolve(decoded) : reject(error)));
  });
};

module.exports = {
  generateJWT,
  verifyJWT,
};
