const bcrypt = require("bcrypt");
const { generateJWT, verifyJWT } = require("./jwt");
const Cookies = require("./Cookie");

const validateCredentials = async (credentials, result) => {
  const { email, password } = credentials;

  return new Promise(async (resolve, reject) => {
    //!result => User not found => reject()
    if (!result) return reject({ error: "User not found" });
    //wenn userInput.email === result.email dann vergleiche das Passwort
    if (email === result.email) {
      //wenn Passwörter nicht übereinstimmen => reject()
      const passwordsDoMatch = await bcrypt.compare(password, result.password);
      if (passwordsDoMatch)
        return resolve({
          id: result.id,
          email: result.email,
          admin: result.admin,
          name: result.name,
          surname: result.surname,
        });

      return reject({ error: "user found but wrong password" });
    }
  });
};

/**
 * verifies the provided access token and generates a new one
 * @param {*} accessToken jwt access token sent by request
 * @returns {*} `{cookies, userData}` cookies Array and TMT userData Object
 */
const authorizeUser = (accessToken) => {
  return new Promise(async (resolve, reject) => {
    try {
      const userData = await verifyJWT(accessToken);
      const generatedNew = await generateJWT(userData, Cookies.TOKEN_EXPIRY);
      const cookies = await Cookies.get(generatedNew.token);

      return resolve({ cookies, userData });
    } catch (error) {
      console.log("user authorization failed", error.error || error);
      return reject(error.error || error);
    }
  });
};

module.exports = {
  validate: validateCredentials,
  authorizeUser,
};
