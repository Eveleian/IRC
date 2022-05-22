const channels = require("../controllers/channels.controller.js");

var router = require("express").Router();

// Create a new User
router.post("/", channels.create);

// Retrieve all Users
router.get("/", channels.findAll);

// Retrieve a single User with channel_id
router.get("/:channel_id", channels.findOne);

// Update a User with channel_id
router.put("/:channel_id", channels.update);

// Delete a User with channel_id
router.delete("/:channel_id", channels.delete);

// Delete all Users
router.delete("/", channels.deleteAll);

module.exports = router