var mysql = require("mysql");

var connection = mysql.createConnection({
host :'localhost',
user:'root',
password:null,
database:'storysketch',
})


connection.connect(function(error) {
if (error) {
console.log("Connection fatal:", error.fatal);
}
});

module.exports = connection;
