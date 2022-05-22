const Channel = require("../models/channels.model.js");

// Create and Save a new Channel
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }
  
    // Create a Channel
    const channel = new Channel({
        channel_name: req.body.channel_name,
    });
  
    // Save Channel in the database
    Channel.getAll(channel.channel_name, (err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving channels."
            });
            return;
        }
        if (data.length == 0) {
            Channel.create(channel, (err, data) => {
                if (err)
                    res.status(500).send({
                        message: err.message || "Some error occurred while creating the Channel."
                    });
                else res.send(data);
            });
        } else {
            res.status(301).err({
                message: "A channel already exist with this name."
            });
            return;
        }
    });
};

// Retrieve all Users from the database (with condition).
exports.findAll = (req, res) => {
    const channel_name = req.query.channel_name;
  
    Channel.getAll(channel_name, (err, data) => {
        if (err)
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving channels."
            });
        else res.send(data);
    });
};

// Find a single Channel with a channel_id
exports.findOne = (req, res) => {
    Channel.findById(req.params.channel_id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Channel with channel_id ${req.params.channel_id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving Channel with channel_id " + req.params.channel_id
                });
            }
        } else res.send(data);
    });
};

// Update a Channel identified by the channel_id in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
        message: "Content can not be empty!"
        });
    }

    Channel.updateById(
        req.params.channel_id,
        new Channel(req.body),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found Channel with channel_id ${req.params.channel_id}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error updating Channel with channel_id " + req.params.channel_id
                    });
                }
            } else res.send(data);
        }
    );
};

// Delete a Channel with the specified channel_id in the request
exports.delete = (req, res) => {
    Channel.remove(req.params.channel_id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Channel with channel_id ${req.params.channel_id}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete Channel with channel_id " + req.params.channel_id
                });
            }
        } else res.send({ message: `Channel was deleted successfully!` });
    });
  };

// Delete all Channels from the database.
exports.deleteAll = (req, res) => {
    Channel.removeAll((err, data) => {
        if (err)
                res.status(500).send({
                    message: err.message || "Some error occurred while removing all channels."
                });
        else res.send({ message: `All Channels were deleted successfully!` });
    });
  };