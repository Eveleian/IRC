const Channel_messages = require("../models/channel_messages.model.js");

// Create and Save a new Channel_messages
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }
  
    // Create a Channel_messages
    const channel_message = new Channel_messages({
        channel_id: req.body.channel_id,
        user_id: req.body.user_id,
        message: req.body.message
    });
  
    // Save Channel_messages in the database
    Channel_messages.create(channel_message, (err, data) => {
        if (err)
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Channel_messages."
            });
        else res.send(data);
    });
};

// Retrieve all Channel_messages from the database (with condition).
exports.findAll = (req, res) => {
    const channel_id = req.query.channel_id;
    Channel_messages.getAll(channel_id, (err, data) => {
        if (err)
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving channel_messages."
            });
        else res.send(data);
    });
};

// Find a single Channel_messages with a channel_message_id
exports.findOne = (req, res) => {
    Channel_messages.findById(req.params.channel_message_id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Channel_messages with channel_message_id ${req.params.channel_message_id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving Channel_messages with channel_message_id " + req.params.channel_message_id
                });
            }
        } else res.send(data);
    });
};

// Update a Channel_messages identified by the channel_message_id in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
        message: "Content can not be empty!"
        });
    }

    Channel_messages.updateById(
        req.params.channel_message_id,
        new Channel_messages(req.body),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found Channel_messages with channel_message_id ${req.params.channel_message_id}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error updating Channel_messages with channel_message_id " + req.params.channel_message_id
                    });
                }
            } else res.send(data);
        }
    );
};

// Delete a Channel_messages with the specified channel_message_id in the request
exports.delete = (req, res) => {
    Channel_messages.remove(req.params.channel_message_id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Channel_messages with channel_message_id ${req.params.channel_message_id}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete Channel_messages with channel_message_id " + req.params.channel_message_id
                });
            }
        } else res.send({ message: `Channel_messages was deleted successfully!` });
    });
  };

// Delete all Channel_messages from the database.
exports.deleteAll = (req, res) => {
    Channel_messages.removeAll((err, data) => {
        if (err)
                res.status(500).send({
                    message: err.message || "Some error occurred while removing all channel_messages."
                });
        else res.send({ message: `All Channel_messages were deleted successfully!` });
    });
  };