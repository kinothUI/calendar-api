const express = require("express");
const multer = require("multer");
const router = express.Router();

const upstream = multer();

//Load Public Controller
const { login, account, logout } = require("../../controllers/publicController");

router.post("/login", upstream.none(), login);
router.get("/account", account);
router.post("/logout", logout);

module.exports = router;
