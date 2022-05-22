const channel_messages = require("../controllers/channel_messages.controller.js");

var router = require("express").Router();

// Create a new Channel message
router.post("/", channel_messages.create);

// Retrieve all Channel messages
router.get("/", channel_messages.findAll);

// Retrieve a single Channel message with channel_message_id
router.get("/:channel_message_id", channel_messages.findOne);

// Update a Channel message with channel_message_id
router.put("/:channel_message_id", channel_messages.update);

// Delete a Channel message with channel_message_id
router.delete("/:channel_message_id", channel_messages.delete);

// Delete all Channel messages
router.delete("/", channel_messages.deleteAll);

module.exports = router