const settings = {
  connectionLimit: 10,
  host: "localhost",
  user: "calender",
  password: "calender",
  database: "calender",
  debug: process.env.NODE_ENV === "production" ? false : true,
};

module.exports = {
  settings,
};
