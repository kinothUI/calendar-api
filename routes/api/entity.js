const express = require("express");
const router = express.Router();

//Load Controllers
const {
  createEntity,
  fetchEntity,
  patchEntity,
  deleteEntity,
} = require("../../controllers/entityController");

router.post("/:entity", createEntity);
router.get("/:entity", fetchEntity);
router.patch("/:entity", patchEntity);
router.delete("/:entity", deleteEntity);

module.exports = router;
