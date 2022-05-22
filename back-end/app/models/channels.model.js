const sql = require("./db.js");

// constructor
const Channel = function(user) {
  this.channel_name = user.channel_name;
};

Channel.create = (newChannel, result) => {
  sql.query("INSERT INTO Channels SET ?", newChannel, (err, res) => {
    if (err) {
      // console.log("error: ", err);
      result(err, null);
      return;
    }

    // console.log("channel created: ", { channel_id: res.insertId, ...newChannel });
    result(null, { channel_id: res.insertId, ...newChannel });
  });
};

Channel.findById = (channel_id, result) => {
  sql.query(`SELECT * FROM Channels WHERE channel_id = ${channel_id}`, (err, res) => {
    if (err) {
      // console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      // console.log("found channel: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Channel with the channel_id
    result({ kind: "not_found" }, null);
  });
};

Channel.getAll = (channel_name, result) => {
  let query = "SELECT * FROM Channels";

  if (channel_name) {
    query += ` WHERE channel_name LIKE '%${channel_name}%'`;
  }

  sql.query(query, (err, res) => {
    if (err) {
      // console.log("error: ", err);
      result(null, err);
      return;
    }

    // console.log("Channels: ", res);
    result(null, res);
  });
};

Channel.updateById = (channel_id, user, result) => {
  sql.query(
    "UPDATE Channels SET channel_name = ? WHERE channel_id = ?",
    [Channel.channel_name, channel_id],
    (err, res) => {
      if (err) {
        // console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Channel with the channel_id
        result({ kind: "not_found" }, null);
        return;
      }

      // console.log("updated channel: ", { channel_id: channel_id });
      result(null, { channel_id: channel_id });
    }
  );
};

Channel.remove = (channel_id, result) => {
  sql.query("DELETE FROM Channels WHERE channel_id = ?", channel_id, (err, res) => {
    if (err) {
      // console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Channel with the channel_id
      result({ kind: "not_found" }, null);
      return;
    }

    // console.log("deleted channel with channel_id: ", channel_id);
    result(null, res);
  });
};

Channel.removeAll = result => {
  sql.query("DELETE FROM Channels", (err, res) => {
    if (err) {
      // console.log("error: ", err);
      result(null, err);
      return;
    }

    // console.log(`deleted ${res.affectedRows} Channels`);
    result(null, res);
  });
};

module.exports = Channel;
