const express = require("express");
const router = express.Router();

//Load Controllers
const { patchAccount } = require("../../controllers/accountController");

router.patch("/patch", patchAccount);

module.exports = router;
