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
    choices: ["employee", "role", "department", "test"],
  },
];

const runCommand = {
  employee: async () => {
    console.log(`You have chosen to employee`);
    db.query(
      `SELECT 
      emp.id AS 'id',
      emp.first_name,
      emp.last_name,
      emp.role_id AS title,
      
      title AS title,
          
      department_id AS department,
      name AS department,
      
      salary,
  
      CONCAT(m.last_name,', ',m.first_name)AS 'manager'

      FROM employee emp 
      LEFT JOIN employee m ON m.id = emp.manager_id                
      JOIN role ON emp.role_id = role.id
      JOIN department ON role.department_id = department.id
      ORDER BY id;
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
    db.query(
      `SELECT role.id,
      title,
      department_id AS department,
      salary,
      name AS department
      FROM role         
      JOIN department ON role.department_id = department.id
      ORDER BY id
      ;
         `,
      (req, res) => {
        console.table(res);
        nextPrompt();
      }
    );
    return;
  },

  department: async () => {
    console.log(`You have chosen to department`);
    db.query(
      `SELECT department.id, department.name AS department FROM department;
         `,
      (req, res) => {
        console.table(res);
        nextPrompt();
      }
    );
    return;
  },
};

const promptUser = async () => {
  const answers = await inquirer.prompt(questions);
  await runCommand[answers.menu]();
};
(err) => {
  console.error(err);
};

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
