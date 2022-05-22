const users = require("../controllers/users.controller.js");

var router = require("express").Router();

// Signup
router.post("/signup", users.create);

// Login
router.post("/login", users.login);

// Retrieve all Users
router.get("/", users.findAll);

// Retrieve a single User with user_id
router.get("/:user_id", users.findOne);

// Update a User with user_id
router.put("/:user_id", users.update);

// Delete a User with user_id
router.delete("/:user_id", users.delete);

// Delete all Users
router.delete("/", users.deleteAll);

module.exports = router