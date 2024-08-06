const connection = require("./module");

function login(userName , userPassword) {
  return new Promise((resolve, reject) => {
    let sql = "SELECT * FROM users WHERE userName = ? and userPassword = ? ";
    connection.query(sql, [userName,userPassword], (err, results) => {
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

function signup(userName , userPassword , userGmail) {
return new Promise((resolve, reject) => {
let sql = "INSERT INTO users (userName , userPassword , userGmail) VALUES (?,?,?); ";
connection.query(sql, [userName , userPassword , userGmail], (err, results) => {
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


module.exports = {login,signup}