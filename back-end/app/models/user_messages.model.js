const sql = require("./db.js");

// constructor
const User_message = function(user_message) {
  this.from_user_id = user_message.from_user_id;
  this.to_user_id = user_message.to_user_id;
  this.message = user_message.message;
};

User_message.create = (newUserMessage, result) => {
  sql.query("INSERT INTO User_messages SET ?", newUserMessage, (err, res) => {
    if (err) {
      // console.log("error: ", err);
      result(err, null);
      return;
    }

    // console.log("user message created: ", { user_message_id: res.insertId, ...newUserMessage });
    result(null, { user_message_id: res.insertId, ...newUserMessage });
  });
};

User_message.findById = (user_id, result) => {
  sql.query(`SELECT * FROM User_messages WHERE from_user_id = ${user_id} OR to_user_id = ${user_id}`, (err, res) => {
    if (err) {
      // console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      // console.log("found user message: ", res);
      result(null, res);
      return;
    }

    // not found User_message with the user_message_id
    result({ kind: "not_found" }, null);
  });
};

User_message.getAll = (message, result) => {
  let query = "SELECT * FROM User_messages";

  if (message) {
    query += ` WHERE message LIKE '%${message}%'`;
  }

  sql.query(query, (err, res) => {
    if (err) {
      // console.log("error: ", err);
      result(null, err);
      return;
    }

    // console.log("User_messages: ", res);
    result(null, res);
  });
};

User_message.getAllBetween = (users, result) => {
  sql.query("SELECT * FROM User_messages WHERE (from_user_id = ? AND to_user_id = ?) OR (from_user_id = ? AND to_user_id = ?)",
  [users.first_user_id, users.second_user_id, users.second_user_id, users.first_user_id], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    // console.log("User_messages: ", res);
    result(null, res);
  });
};

User_message.updateById = (user_message_id, user_message, result) => {
  sql.query(
    "UPDATE User_messages SET from_user_id = ?, to_user_id = ?, message = ? WHERE user_message_id = ?",
    [User_message.pseudo, User_message.password, user_message_id],
    (err, res) => {
      if (err) {
        // console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found User_message with the user_message_id
        result({ kind: "not_found" }, null);
        return;
      }

      // console.log("updated user message: ", { user_message_id: user_message_id, ...user_message });
      result(null, { user_message_id: user_message_id, ...user_message });
    }
  );
};

User_message.remove = (user_message_id, result) => {
  sql.query("DELETE FROM User_messages WHERE user_message_id = ?", user_message_id, (err, res) => {
    if (err) {
      // console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found User_message with the user_message_id
      result({ kind: "not_found" }, null);
      return;
    }

    // console.log("deleted user message with user_message_id: ", user_message_id);
    result(null, res);
  });
};

User_message.removeAll = result => {
  sql.query("DELETE FROM User_messages", (err, res) => {
    if (err) {
      // console.log("error: ", err);
      result(null, err);
      return;
    }

    // console.log(`deleted ${res.affectedRows} User_messages`);
    result(null, res);
  });
};

module.exports = User_message;
