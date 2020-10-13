const mysql = require("../mysql/mysql-connector");
const { ACCESS_TOKEN_NAME } = require("../modules/Cookie");
const send = require("../modules/response");
const { MESSAGE } = require("../modules/Messages");
const { authorizeUser } = require("../modules/Authorization");

const patchAccount = async (req, res) => {
  try {
    const { id, name, surname, email } = req.body;
    const accessToken = req.cookies[ACCESS_TOKEN_NAME];

    const { cookies } = await authorizeUser(accessToken);

    const UPDATE_USER_QUERY = `UPDATE user SET name='${name}', surname='${surname}', email='${email}' WHERE id=${id};`;
    await mysql.query(UPDATE_USER_QUERY);

    send.authorized(res, cookies, 200);
  } catch (error) {
    console.log("PatchAccount", error.error || error);
    send.unauthorized(res, 401, MESSAGE.UNAUTHORIZED);
  }
};

module.exports = {
  patchAccount,
};
