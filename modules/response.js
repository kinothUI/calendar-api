/**
 * module to response on authorized request with payload or status only
 * @param {*} res Express res parameter
 * @param {*} cookies as Array
 * @param {*} payload as Object or Number
 * @returns Express response
 */
const authorized = (res, cookies, payload) => {
  cookies.forEach((cookie) => {
    const { name, value } = cookie;
    res.cookie(name, value, { ...cookie, encode: String });
  });
  return typeof payload === "object" ? res.json(payload) : res.sendStatus(payload);
};

/**
 * module to response on unauthorized request with JSON or status only
 * @param {*} res Express res parameter
 * @param {*} status as Number
 * @param {*} message as Object or nothing
 * @returns Express response
 */
const unauthorized = (res, status, message) => {
  return typeof message === "object"
    ? res.status(status).setHeader("Content-Type", "application/problem+json").json({ message })
    : res.status(status).send(message);
};

module.exports = {
  authorized,
  unauthorized,
};
