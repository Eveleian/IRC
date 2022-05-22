const User_messages = require("../models/user_messages.model.js");
const Users = require("../models/users.model.js");

// Create and Save a new User_messages
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }
  
    // Create a User_messages
    const user_message = new User_messages({
        from_user_id: req.body.from_user_id,
        to_user_id: req.body.to_user_id,
        message: req.body.message
    });
  
    // Save User_messages in the database
    User_messages.create(user_message, (err, data) => {
        if (err)
            res.status(500).send({
                message: err.message || "Some error occurred while creating the User_messages."
            });
        else res.send(data);
    });
};

// Retrieve all User_messages from the database (with condition).
exports.findAll = (req, res) => {
    const message = req.query.message;
  
    User_messages.getAll(message, (err, data) => {
        if (err)
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving user_messages."
            });
        else res.send(data);
    });
};

// Retrieve all User_messages from the database (with condition).
exports.findBetween = (req, res) => {
    Users.getAll(req.query.nickname, (err, data) => {
        if (err)
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving users."
            });
        else if (data.length == 0) {
            res.send(data);
        } else {
            const users = {
                first_user_id: req.query.user_id,
                second_user_id: data[0].user_id
            };
            User_messages.getAllBetween(users, (err, dataBis) => {
                if (err)
                    res.status(500).send({
                        message: err.message || "Some error occurred while retrieving user_messages."
                    });
                else res.send(dataBis);
            });
        }
    });
};

// Find User_messages send and received by a user_id
exports.findOne = (req, res) => {
    User_messages.findById(req.params.user_id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found User_messages with user_message_id ${req.params.user_id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving User_messages with user_message_id " + req.params.user_id
                });
            }
        } else res.send(data);
    });
};

// Update a User_messages identified by the user_message_id in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
        message: "Content can not be empty!"
        });
    }

    User_messages.updateById(
        req.params.user_message_id,
        new User_messages(req.body),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found User_messages with user_message_id ${req.params.user_message_id}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error updating User_messages with user_message_id " + req.params.user_message_id
                    });
                }
            } else res.send(data);
        }
    );
};

// Delete a User_messages with the specified user_message_id in the request
exports.delete = (req, res) => {
    User_messages.remove(req.params.user_message_id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found User_messages with user_message_id ${req.params.user_message_id}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete User_messages with user_message_id " + req.params.user_message_id
                });
            }
        } else res.send({ message: `User_messages was deleted successfully!` });
    });
};

// Delete all User_messages from the database.
exports.deleteAll = (req, res) => {
    User_messages.removeAll((err, data) => {
        if (err)
                res.status(500).send({
                    message: err.message || "Some error occurred while removing all user_messages."
                });
        else res.send({ message: `All User_messages were deleted successfully!` });
    });
};