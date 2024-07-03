var mysql = require("mysql");
var connection = require("./module");

connection.connect(function(error){
if (error){
console.log(error.code);
console.log(error.fatal);
}})

connection.query("SELECT * FROM users", function(err, row,fields){
if (err){
console.log("this is error",err)
return;
}
console.log("mission done",row)
})


connection.end(function(){
console.log("the end")
})
module.exports = connection;