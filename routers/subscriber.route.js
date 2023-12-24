const express = require("express");
const router = express.Router();
const subscriberController = require("../controllers/subscriber.controller");

router.post("/add", subscriberController.add);

module.exports = router;
