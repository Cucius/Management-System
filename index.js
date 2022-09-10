const inquirer = require("inquirer");
const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "96519fdC92**",
  database: "managment_db",
});

connection.connect(function (err) {
  if (err) throw err;
});
