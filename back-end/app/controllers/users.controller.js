const User = require("../models/users.model.js");

// Create and Save a new User
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }
  
    // Create a User
    const user = new User({
        pseudo: req.body.pseudo,
        password: req.body.password
    });
    
    User.getAll(user.pseudo, (err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving users."
            });
            return;
        }
        if (data.length == 0){
            // Save User in the database
            User.create(user, (err, data) => {
                if (err)
                    res.status(500).send({
                        message: err.message || "Some error occurred while creating the User."
                    });
                else res.send(data);
            });
        } else {
            res.status(301).send({
                message: "A user already exist with this pseudo."
            });
            return;
        }
    });

    
};

// Retrieve all Users from the database (with condition).
exports.findAll = (req, res) => {
    const pseudo = req.query.pseudo;
  
    User.getAll(pseudo, (err, data) => {
        if (err)
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving users."
            });
        else res.send(data);
    });
};

// Find a single User with a user_id
exports.login = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    User.findByUser(req.body.pseudo, req.body.password, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found User.`
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving User."
                });
            }
        } else {
            res.send(data);
        }
    })
};

// Find a single User with a user_id
exports.findOne = (req, res) => {
    User.findById(req.params.user_id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found User with user_id ${req.params.user_id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving User with user_id " + req.params.user_id
                });
            }
        } else res.send(data);
    });
};

// Update a User identified by the user_id in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
        message: "Content can not be empty!"
        });
    }

    User.getAll(req.body.pseudo, (err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving users."
            });
            return;
        }
        if (data.length == 0){
            User.updateById(
                req.params.user_id,
                req.body.pseudo,
                (err, data) => {
                    if (err) {
                        if (err.kind === "not_found") {
                            res.status(404).send({
                                message: `Not found User with user_id ${req.params.user_id}.`
                            });
                        } else {
                            res.status(500).send({
                                message: "Error updating User with user_id " + req.params.user_id
                            });
                        }
                    } else res.send(data);
                }
            );
        } else {
            res.status(301).send({
                message: "A user already exist with this pseudo."
            });
            return;
        }
    });
};

// Delete a User with the specified user_id in the request
exports.delete = (req, res) => {
    User.remove(req.params.user_id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found User with user_id ${req.params.user_id}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete User with user_id " + req.params.user_id
                });
            }
        } else res.send({ message: `User was deleted successfully!` });
    });
  };

// Delete all Users from the database.
exports.deleteAll = (req, res) => {
    User.removeAll((err, data) => {
        if (err)
                res.status(500).send({
                    message: err.message || "Some error occurred while removing all users."
                });
        else res.send({ message: `All Users were deleted successfully!` });
    });
  };