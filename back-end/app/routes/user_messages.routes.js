const user_messages = require("../controllers/user_messages.controller.js");

var router = require("express").Router();

// Retrieve all messages between two users
router.get("/between", user_messages.findBetween);

// Create a new User messages
router.post("/", user_messages.create);

// Retrieve all Users messages
router.get("/", user_messages.findAll);

// Retrieve all messages received or send with a user_id
router.get("/:user_id", user_messages.findOne);

// Update a User with user_message_id
router.put("/:user_message_id", user_messages.update);

// Delete a User with user_message_id
router.delete("/:user_message_id", user_messages.delete);

// Delete all Users
router.delete("/", user_messages.deleteAll);

module.exports = router