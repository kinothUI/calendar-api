const _ = require("lodash");
const mysql = require("../mysql/mysql-connector");
const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");
const { ACCESS_TOKEN_NAME } = require("../modules/Cookie");
const send = require("../modules/response");
const { MESSAGE } = require("../modules/Messages");
const { authorizeUser } = require("../modules/Authorization");

const createEntity = async (req, res) => {
  try {
    const { name, surname, email, password } = req.body;
    const { entity } = req.params;
    const accessToken = req.cookies[ACCESS_TOKEN_NAME];

    const { cookies } = await authorizeUser(accessToken);

    const hashedPassword = await bcrypt.hash(password, 10);
    const INSERT_ACCOUNT_QUERY = `INSERT INTO ${entity} (name, surname, email, password) VALUE('${name}', '${surname}', '${email}', '${hashedPassword}');`;
    await mysql.query(INSERT_ACCOUNT_QUERY);

    send.authorized(res, cookies, StatusCodes.CREATED);
  } catch (error) {
    console.log("createEntity", error.error || error);
    send.unauthorized(res, StatusCodes.UNAUTHORIZED, MESSAGE.UNAUTHORIZED);
  }
};

const fetchEntity = async (req, res) => {
  try {
    const { entity } = req.params;
    const accessToken = req.cookies[ACCESS_TOKEN_NAME];

    console.log({ entity });

    const { cookies } = await authorizeUser(accessToken);

    const SELECT_ACCOUNTS_QUERY = `SELECT * FROM ${entity};`;
    const sqlResponse = await mysql.query(SELECT_ACCOUNTS_QUERY);

    const data = Array.isArray(sqlResponse.data) ? sqlResponse.data : Array(sqlResponse.data);

    // remove password from accounts
    if (entity === "account") {
      if (Array.isArray(data))
        data.forEach((account) => {
          delete account.password;
        });
      else delete data.password;
    }

    send.authorized(res, cookies, data);
  } catch (error) {
    console.log("fetchEntity", error.error || error);
    send.unauthorized(res, StatusCodes.UNAUTHORIZED, MESSAGE.UNAUTHORIZED);
  }
};

const patchEntity = async (req, res) => {
  try {
    const { id, name, surname, email } = req.body;
    const { entity } = req.params;
    const accessToken = req.cookies[ACCESS_TOKEN_NAME];

    const { cookies } = await authorizeUser(accessToken);

    const UPDATE_USER_QUERY = `UPDATE ${entity} SET name='${name}', surname='${surname}', email='${email}' WHERE id=${id};`;
    await mysql.query(UPDATE_USER_QUERY);

    send.authorized(res, cookies, 200);
  } catch (error) {
    console.log("patchEntity", error.error || error);
    send.unauthorized(res, StatusCodes.UNAUTHORIZED, MESSAGE.UNAUTHORIZED);
  }
};

const deleteEntity = async (req, res) => {
  try {
    const { id } = req.body;
    const { entity } = req.params;
    const accessToken = req.cookies[ACCESS_TOKEN_NAME];

    const { cookies } = await authorizeUser(accessToken);

    const DELETE_ACCOUNT_QUERY = `DELETE FROM ${entity} WHERE id='${id}';`;
    await mysql.query(DELETE_ACCOUNT_QUERY);

    send.authorized(res, cookies, StatusCodes.CREATED);
  } catch (error) {
    console.log("deleteEntity", error.error || error);
    send.unauthorized(res, StatusCodes.UNAUTHORIZED, MESSAGE.UNAUTHORIZED);
  }
};

module.exports = {
  createEntity,
  fetchEntity,
  patchEntity,
  deleteEntity,
};
