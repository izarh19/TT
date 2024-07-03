
const connection = require("./module");

function inputsform(formID) {
return new Promise((resolve, reject) => {
let sql = "SELECT * FROM inputs JOIN form_input ON form_input.inputID =inputs.inputID  WHERE form_input.formID = ?;"
console.log(sql);
connection.query(sql, [formID], (err, results) => {
  console.log()
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
module.exports = {inputsform};


    


