const connection = require("./module");

function menuid(MID) {
  return new Promise((resolve, reject) => {
    let sql = "SELECT * FROM menus WHERE MID = ?";
    connection.query(sql, [MID], (err, results) => {
      if (err) {
        console.error("there is an error", err);
        reject(err);
      } else {
        console.log("mission donee", results);
        resolve(results);
      }
    });
  });
}

module.exports = menuid;
