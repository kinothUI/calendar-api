const Express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

require("dotenv").config();

/**
 * @todo handle token expiration
 */
const firstHandler = (req, res, next) => {
  // handle expired cookies here
  next();
};

const app = Express();

const isProdEnv = process.env.NODE_ENV === "production";
const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || 8000;

if (!isProdEnv) {
  const pino = require("express-pino-logger")();
  app.use(pino);
}

console.log("Environment", process.env.NODE_ENV);

app.use(cors(isProdEnv ? {} : { origin: "http://localhost:3000", credentials: true }));
app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// loading routes
const PublicData = require("./routes/public/index");
const EntityData = require("./routes/api/entity");

app.use("/public", PublicData);
app.use("/api/entity", firstHandler, EntityData);

app.listen(PORT, HOST, () => {
  console.log("API started");
  console.log(`API accepting connections on ${HOST}:${PORT}`);
});
