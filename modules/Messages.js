const UNAUTHORIZED = {
  title: "unauthorized",
  status: 401,
  message: "authentication required to fetch this resource",
};

const WRONG_CREDENTIALS = {
  title: "unauthorized",
  status: 401,
  message: "wrong username or password",
};

module.exports = {
  MESSAGE: {
    UNAUTHORIZED,
    WRONG_CREDENTIALS,
  },
};
