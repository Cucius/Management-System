const inquirer = require("inquirer");
const mysql = require("mysql2");
const express = require("express");
const db = require("./config/connection");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

db.connect(
  () => {
    app.listen(PORT, () => console.log("Now listening"));

    promptUser();
  },
  (err) => {
    if (err) throw err;
  }
);

const questions = [
  {
    type: "list",
    name: "menu",
    message: "What would you like to do?",
    choices: ["employee", "role", "department"],
  },
];

const runCommand = {
  employee: async () => {
    console.log(`You have chosen to employee`);
    db.query(
      `SELECT employee.id, role.id, department.id,
          first_name,
          last_name,
          
          role_id AS title,
          title AS title,
          
          salary,
          
          department_id AS department,
          name AS department
  
          FROM employee
          
          JOIN role ON employee.role_id = role.id
          JOIN department ON role.department_id = department.id
          ;
         `,
      (req, res) => {
        console.table(res);
        nextPrompt();
      }
    );
    return;
  },
  role: async () => {
    console.log(`You have chosen to role`);
    await promptUser();
  },
};

const promptUser = async () => {
  const answers = await inquirer.prompt(questions);
  await runCommand[answers.menu]();
};
(err) => {
  console.error(err);
};

//View

const nextPrompt = async () => {
  let answer = await inquirer.prompt({
    type: "confirm",
    message: "Do you want to continue?",
    default: false,
    name: "continue",
  });
  if (answer.continue === false) {
    process.exit();
  } else {
    promptUser();
  }
};
