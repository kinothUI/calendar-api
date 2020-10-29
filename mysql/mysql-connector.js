const mysql = require("mysql");
const { settings } = require("./config");

const connection = mysql.createPool(settings);

const mysqlConnector = (sql) => {
  return new Promise((resolve, reject) => {
    connection.query(sql, (err, results) => {
      if (err) return reject({ error: err.code });
      else return resolve(results);
    });
  });
};

module.exports = {
  query: mysqlConnector,
};
