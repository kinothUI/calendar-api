require("dotenv").config();
const mysql = require("../mysql/mysql-connector");
const user = require("../modules/Authorization");
const { generateJWT, verifyJWT } = require("../modules/jwt");
const send = require("../modules/response");
const Cookies = require("../modules/Cookie");
const { MESSAGE } = require("../modules/Messages");
const { withTeams } = require("../modules/helper");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const SELECT_USER_QUERY = `SELECT * FROM account WHERE email='${email}';`;

    const sqlResponse = await mysql.query(SELECT_USER_QUERY);
    const validatedUser = await user.validate({ email, password }, sqlResponse.data);
    const generated = await generateJWT(validatedUser, Cookies.TOKEN_EXPIRY);
    const cookies = await Cookies.get(generated.token);

    send.authorized(res, cookies, 200);
    console.log("successfull login-request for", email);
  } catch (error) {
    console.log("login in publicController.js", error.error || error);
    send.unauthorized(res, 401);
  }
};

const account = async (req, res) => {
  try {
    const { accountPatched, email } = req.body;
    const accessToken = req.cookies[Cookies.ACCESS_TOKEN_NAME];

    if (!accessToken) return res.sendStatus(204);

    const userData = await verifyJWT(accessToken);
    const account = await withTeams(Array(userData));

    const newGenerated = await generateJWT(userData, Cookies.TOKEN_EXPIRY);
    const cookies = await Cookies.get(newGenerated.token);

    send.authorized(res, cookies, ...account);
    console.log("successfull account-request: ", userData);
  } catch (error) {
    console.log("account", error.error || error);
    send.unauthorized(res, 204, MESSAGE.UNAUTHORIZED);
  }
};

const logout = async (req, res) => {
  try {
    const accessToken = req.cookies[Cookies.ACCESS_TOKEN_NAME];
    const { id } = await verifyJWT(accessToken);

    const cookies = await Cookies.remove();
    console.log("successfull logout-request: ", id);
    send.authorized(res, cookies, 200);
  } catch (error) {
    console.log("logout in publicController.js", error.error || error);
    send.unauthorized(res, 204, MESSAGE.UNAUTHORIZED);
  }
};

module.exports = {
  login,
  logout,
  account,
};
