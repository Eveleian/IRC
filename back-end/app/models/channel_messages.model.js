const sql = require("./db.js");

// constructor
const Channel_message = function(channel_message) {
  this.channel_id = channel_message.channel_id;
  this.user_id = channel_message.user_id;
  this.message = channel_message.message;
};

Channel_message.create = (newChannelMessage, result) => {
  sql.query("INSERT INTO Channel_messages SET ?", newChannelMessage, (err, res) => {
    if (err) {
      // console.log("error: ", err);
      result(err, null);
      return;
    }

    // console.log("channel message created: ", { channel_message_id: res.insertId, ...newChannelMessage });
    result(null, { channel_message_id: res.insertId, ...newChannelMessage });
  });
};

Channel_message.findById = (channel_message_id, result) => {
  sql.query(`SELECT * FROM Channel_messages WHERE channel_message_id = ${channel_message_id}`, (err, res) => {
    if (err) {
      // console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      // console.log("found channel message: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Channel_message with the channel_message_id
    result({ kind: "not_found" }, null);
  });
};

Channel_message.getAll = (channel_id, result) => {
  let query = "SELECT * FROM Channel_messages";

  if (channel_id) {
    query += ` WHERE channel_id LIKE '%${channel_id}%'`;
  }

  sql.query(query, (err, res) => {
    if (err) {
      // console.log("error: ", err);
      result(null, err);
      return;
    }

    // console.log("Channel messages: ", res);
    result(null, res);
  });
};

Channel_message.updateById = (channel_message_id, channel_message, result) => {
  sql.query(
    "UPDATE Channel_messages SET channel_id = ?, user_id = ?, message = ? WHERE channel_message_id = ?",
    [Channel_message.pseudo, Channel_message.password, channel_message_id],
    (err, res) => {
      if (err) {
        // console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Channel_message with the channel_message_id
        result({ kind: "not_found" }, null);
        return;
      }

      // console.log("updated channel message: ", { channel_message_id: channel_message_id, ...channel_message });
      result(null, { channel_message_id: channel_message_id, ...channel_message });
    }
  );
};

Channel_message.remove = (channel_message_id, result) => {
  sql.query("DELETE FROM Channel_messages WHERE channel_message_id = ?", channel_message_id, (err, res) => {
    if (err) {
      // console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Channel_message with the channel_message_id
      result({ kind: "not_found" }, null);
      return;
    }

    // console.log("deleted channel_message with channel_message_id: ", channel_message_id);
    result(null, res);
  });
};

Channel_message.removeAll = result => {
  sql.query("DELETE FROM Channel_messages", (err, res) => {
    if (err) {
      // console.log("error: ", err);
      result(null, err);
      return;
    }

    // console.log(`deleted ${res.affectedRows} Channel_messages`);
    result(null, res);
  });
};

module.exports = Channel_message;
