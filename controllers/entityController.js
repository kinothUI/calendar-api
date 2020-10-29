const _ = require("lodash");
const mysql = require("../mysql/mysql-connector");
const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");
const { ACCESS_TOKEN_NAME } = require("../modules/Cookie");
const send = require("../modules/response");
const { MESSAGE } = require("../modules/Messages");
const { authorizeUser } = require("../modules/Authorization");
const { asyncForEach, withTeams } = require("../modules/helper");

const GET = "GET";
const POST = "POST";
const PATCH = "PATCH";
const DELETE = "DELETE";

const EntityDescription = {
  account: "account",
  team: "team",
  room: "room",
};

/**
 * POST Controller
 */
const createEntity = async (req, res) => {
  try {
    const { entity } = req.params;
    const accessToken = req.cookies[ACCESS_TOKEN_NAME];

    const { cookies } = await authorizeUser(accessToken);

    // Entity Account
    if (entity === EntityDescription.account) {
      const { name, surname, email, admin, teams } = req.body;

      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const PERSIST_ACCOUNT_Q = `INSERT INTO ${entity} (name, surname, email, password, admin) VALUES ('${name}', '${surname}', '${email}', '${hashedPassword}', ${
        admin ? true : false
      } );`;
      const persistedAccount = await mysql.query(PERSIST_ACCOUNT_Q);

      // Persist selected Teams
      if (teams && teams.length) {
        try {
          await asyncForEach(teams, async (team) => {
            const PERSIST_ACCOUNT_TEAMS_Q = `INSERT INTO account_team (account_id, team_id) VALUES(${persistedAccount.insertId}, ${team.id});`;
            await mysql.query(PERSIST_ACCOUNT_TEAMS_Q);
          });
        } catch (error) {
          console.log("error while persisting to table account_team", error);
          // send something to the user
        }
      }
    }

    // Entity Team
    if (entity === EntityDescription.team) {
      const { name } = req.body;

      const TEAM_QUERY = `INSERT INTO ${entity} (name) VALUES ('${name}');`;
      await mysql.query(TEAM_QUERY);
    }

    // Entity Room
    if (entity === EntityDescription.room) {
      const { name } = req.body;

      const ROOM_QUERY = `INSERT INTO ${entity} (name) VALUES ('${name}');`;
      await mysql.query(ROOM_QUERY);
    }

    send.authorized(res, cookies, StatusCodes.CREATED);
  } catch (error) {
    console.log("createEntity", error.error || error);
    send.unauthorized(res, StatusCodes.UNAUTHORIZED, MESSAGE.UNAUTHORIZED);
  }
};

/**
 * GET Controller
 */
const fetchEntity = async (req, res) => {
  try {
    const { entity } = req.params;
    const accessToken = req.cookies[ACCESS_TOKEN_NAME];

    const { cookies } = await authorizeUser(accessToken);

    // Entity Account
    if (entity === EntityDescription.account) {
      const SELECT_ACCOUNTS_Q = `SELECT id, CONCAT('a', id) as identifier, name, surname, email, admin FROM ${entity};`;
      const result = await mysql.query(SELECT_ACCOUNTS_Q);

      const accounts = await withTeams(result);

      if (!result.length) return send.authorized(res, cookies, StatusCodes.NO_CONTENT);
      else return send.authorized(res, cookies, accounts);
    }

    // Entity Team
    if (entity === EntityDescription.team) {
      const SELECT_TEAM_Q = `SELECT id, CONCAT('t', id) as identifier, name FROM ${entity};`;
      const result = await mysql.query(SELECT_TEAM_Q);

      if (!result.length) return send.authorized(res, cookies, StatusCodes.NO_CONTENT);
      else return send.authorized(res, cookies, result);
    }

    // Entity Room
    if (entity === EntityDescription.room) {
      const SELECT_ROOM_Q = `SELECT id, CONCAT('r', id) as identifier, name FROM ${entity};`;
      const result = await mysql.query(SELECT_ROOM_Q);

      if (!result.length) return send.authorized(res, cookies, StatusCodes.NO_CONTENT);
      else return send.authorized(res, cookies, result);
    }
  } catch (error) {
    console.log("fetchEntity", error.error || error);
    send.unauthorized(res, StatusCodes.UNAUTHORIZED, MESSAGE.UNAUTHORIZED);
  }
};

/**
 * PATCH Controller
 */
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

/**
 * DELETE Controller
 */
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
