const inquirer = require("inquirer");
const mysql = require("mysql2");
const express = require("express");
const sequelize = require("./config/connection");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

sequelize.connect(function (err) {
  if (err) throw err;

  promptUser();
});

const promptUser = async () => {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do?",
        choices: ["Add", "View", "Update", "Delete"],
        name: "action",
      },
      {
        type: "list",
        message: "Select from the options below:",
        choices: ["Employee", "Role", "Department"],
        name: "option",
      },
    ])
    .then(function (res) {
      console.log(`You have chosen to ${toLowerCase(res.action)} a ${toLowerCase(res.option)}`);

      switch (res.action) {
        case "Add":
          createData(res.option);
          break;
        case "View":
          readData(res.option);
          break;
        case "Update":
          updateData(res.option);
          break;
        case "Delete":
          deleteData(res.option);
          break;
      }
    })
    .catch(function (err) {
      console.error(err);
    });
};
