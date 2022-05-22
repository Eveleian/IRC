const sql = require("./db.js");

// constructor
const User = function(user) {
  this.pseudo = user.pseudo;
  this.password = user.password;
};

User.create = (newUser, result) => {
  sql.query("INSERT INTO Users SET ?", newUser, (err, res) => {
    if (err) {
      // console.log("error: ", err);
      result(err, null);
      return;
    }

    // console.log("user created: ", { user_id: res.insertId, ...newUser });
    result(null, { user_id: res.insertId, ...newUser });
  });
};

User.findByUser = (user_pseudo, user_password, result) => {
  sql.query(`SELECT * FROM Users WHERE pseudo = '${user_pseudo}' AND password = '${user_password}'`, (err, res) => {
    if (err) {
      // console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      // console.log("found user: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found User with the user_id
    result({ kind: "not_found" }, null);
  });
};

User.findById = (user_id, result) => {
  sql.query(`SELECT * FROM Users WHERE user_id = ${user_id}`, (err, res) => {
    if (err) {
      // console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      // console.log("found user: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found User with the user_id
    result({ kind: "not_found" }, null);
  });
};

User.getAll = (pseudo, result) => {
  let query = "SELECT * FROM Users";

  if (pseudo) {
    query += ` WHERE pseudo LIKE '%${pseudo}%'`;
  }

  sql.query(query, (err, res) => {
    if (err) {
      // console.log("error: ", err);
      result(null, err);
      return;
    }

    // console.log("Users: ", res);
    result(null, res);
  });
};

User.updateById = (user_id, pseudo, result) => {
  sql.query(
    "UPDATE Users SET pseudo = ? WHERE user_id = ?",
    [pseudo, user_id],
    (err, res) => {
      if (err) {
        // console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found User with the user_id
        result({ kind: "not_found" }, null);
        return;
      }

      // console.log("updated user: ", { user_id: user_id });
      result(null, { user_id: user_id});
    }
  );
};

User.remove = (user_id, result) => {
  sql.query("DELETE FROM Users WHERE user_id = ?", user_id, (err, res) => {
    if (err) {
      // console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found User with the user_id
      result({ kind: "not_found" }, null);
      return;
    }

    // console.log("deleted user with user_id: ", user_id);
    result(null, res);
  });
};

User.removeAll = result => {
  sql.query("DELETE FROM Users", (err, res) => {
    if (err) {
      // console.log("error: ", err);
      result(null, err);
      return;
    }

    // console.log(`deleted ${res.affectedRows} Users`);
    result(null, res);
  });
};

module.exports = User;
