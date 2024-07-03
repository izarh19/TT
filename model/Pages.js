const connection = require("./module");

function page( pageID) {
console.log("hdjfjfjf");
  return new Promise((resolve, reject) => {
    let sql = "SELECT * FROM pages WHERE pageID = ?";
    connection.query(sql, [ pageID], (err, results) => {
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

module.exports = {page};