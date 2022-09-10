const inquirer = require("inquirer");
const mysql = require("mysql2");
const express = require("express");
const sequelize = require("./config/connection");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

sequelize.sync().then(
  () => {
    app.listen(PORT, () => console.log("Now listening"));

    promptUser();
  },
  (err) => {
    if (err) throw err;
  }
);

const promptUser = () => {
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
      console.log(`You have chosen to ${res.action} a ${res.option}`);

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
    .catch((err) => {
      console.error(err);
    });
};

const readData = () => {
  switch (res) {
    case "Employee":
      console.log("Showing all employees...\n");
      sequelize.query("SELECT * FROM employee", function (err, res) {
        if (err) throw err;

        console.table(res);

        nextPrompt();
      });
      break;
    case "Role":
      console.log("Showing all roles...\n");
      sequelize.query("SELECT * FROM role", function (err, res) {
        if (err) throw err;

        console.table(res);

        nextPrompt();
      });
      break;
    case "Department":
      console.log("Showing all departments...\n");
      sequelize.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;

        console.table(res);

        nextPrompt();
      });
      break;
  }
};

const nextPrompt = async () => {
  let answer = await inquirer.prompt({
    type: "confirm",
    message: "Do you want to continue?",
    default: false,
    name: "continue",
  });
  if (answer.continue === true) {
    promptUser();
  } else {
    sequelize.close();
  }
};
