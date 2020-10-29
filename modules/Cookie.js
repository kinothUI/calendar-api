const moment = require("moment");

const ACCESS_TOKEN_NAME = "ACCESS-TOKEN";
const TOKEN_EXPIRY_NAME = "ACCESS-TOKEN-EXPIRY";
const now = moment();
const TOKEN_EXPIRY = 60 * 60 * 3; // token expires in 3 hours
const TOKEN_EXPIRY_DATE = moment(TOKEN_EXPIRY * 1000 + now)
  .toDate()
  .toJSON();
const TOKEN_EXPIRED_DATE = moment(new Date(0)).toDate().toJSON();
const COOKIE_MAX_AGE = 1000 * 60 * 60 * 24 * 365 * 42;

const get = (token) =>
  Promise.resolve([
    {
      name: ACCESS_TOKEN_NAME,
      value: token,
      maxAge: COOKIE_MAX_AGE,
      httpOnly: true,
    },
    {
      name: TOKEN_EXPIRY_NAME,
      value: TOKEN_EXPIRY_DATE,
      maxAge: COOKIE_MAX_AGE,
    },
  ]);

const remove = () =>
  Promise.resolve([
    {
      name: ACCESS_TOKEN_NAME,
      value: "",
      maxAge: 0,
      httpOnly: true,
    },
    {
      name: TOKEN_EXPIRY_NAME,
      value: TOKEN_EXPIRED_DATE,
      maxAge: 0,
    },
  ]);

module.exports = {
  get,
  remove,
  ACCESS_TOKEN_NAME,
  TOKEN_EXPIRY_NAME,
  TOKEN_EXPIRY,
};
