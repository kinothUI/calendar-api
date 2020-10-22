const mysql = require("../mysql/mysql-connector");

const asyncForEach = async (array, callback) => {
  for (let i = 0; i < array.length; i++) {
    await callback(array[i], i, array);
  }
};

const withTeams = async (accounts) =>
  Promise.all(
    accounts.map(async (account) => {
      const SELECT_TEAMS_Q = `SELECT CONCAT('[', GROUP_CONCAT(team_id), ']') as teams FROM account_team WHERE account_id=${account.id};`;
      const { data } = await mysql.query(SELECT_TEAMS_Q);
      return { ...account, teams: JSON.parse(data.teams) };
    })
  );

/**
 * @param num The number to round
 * @param precision The number of decimal places to preserve
 * @source https://stackoverflow.com/questions/5191088/how-to-round-up-a-number-in-javascript#5191133
 */
const roundUp = (num, precision) => {
  precision = Math.pow(10, precision);
  return Math.ceil(num * precision) / precision;
};

module.exports = {
  asyncForEach,
  roundUp,
  withTeams,
};
