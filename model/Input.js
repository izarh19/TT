const connection = require("./module");

function input(inputID) {
  return new Promise((resolve, reject) => {
    let sql = "SELECT *  from inputs WHERE inputID = ?"; 
    connection.query(sql, [inputID], (err, results) => {
      if (err) {
        console.error("There is an error", err);
        reject(err);
      } else {
        console.log("Mission done", results);
        resolve(results);
      }
    });
  });
}

module.exports = input;
