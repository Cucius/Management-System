const inquirer = require("inquirer");
const mysql = require("mysql2");
const sequelize = require("./config/connection");

connection.connect(function (err) {
  if (err) throw err;
});
