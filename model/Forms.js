const connection = require("./module");

function formid(formID) {
  return new Promise((resolve, reject) => {
    let sql = "SELECT * FROM forms WHERE formID = ?";
    connection.query(sql, [formID], (err, results) => {
      if (err) {
        console.error("There is an error", err);
        reject(err);
      } else {
        console.log("Mission donee", results);
        resolve(results);
      }
    });
  });
}

module.exports = formid;

