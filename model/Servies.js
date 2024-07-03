const connection = require("./module");

function servies(drawingserviesID) {
  return new Promise((resolve, reject) => {
    let sql = "SELECT * FROM menus WHERE srid = ?";
    connection.query(sql, [srid], (err, results) => {
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

module.exports = servies