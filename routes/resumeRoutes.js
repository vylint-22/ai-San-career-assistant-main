const express = require("express");
const router = express.Router();
const upload = require("../controllers/resumeController");

router.post("/upload", upload);

module.exports = router;