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
    choices: [
      //VIEW
      { name: "View All Employees", value: "employee" },
      { name: "View All Roles", value: "role" },
      { name: "View All Departments", value: "department" },
      //ADD
      { name: "Add Employee", value: "addEmployee" },
      { name: "Add Role", value: "addRole" },
      { name: "Add Department", value: "addDepartment" },

      "test",
    ],
  },
];

const addDepartment = [
  {
    type: "input",
    message: "Add The Department:",
    name: "addName",
  },
];

const addRole = [
  {
    type: "input",
    message: "Add The Role:",
    name: "addTitle",
  },
  {
    type: "input",
    message: "Add the Salary:",
    name: "addSalary",
  },
  {
    type: "list",
    message: "What Role:",
    choices: role,
    name: "addDepartment",
  },
];

const addEmployee = [
  {
    type: "input",
    message: "Add The First Name:",
    name: "addFirstName",
  },
  {
    type: "input",
    message: "Add The Last Name:",
    name: "addLastName",
  },
  {
    type: "list",
    message: "What Role:",
    choices: [],
    name: "addRole",
  },
];

const runCommand = {
  employee: async () => {
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
  addEmployee: async () => {},

  role: async () => {
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
  addRole: async () => {
    const answer = await inquirer.prompt(addRole);
    db.query(
      `INSERT INTO role (title, salary)
      VALUES ('${answer.addTitle}', ${answer.addTitle});
      `,
      (req, res) => {
        console.log(`Added ${answer.addTitle} to the database`);
        nextPrompt();
      }
    );
    return;
  },

  department: async () => {
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
  addDepartment: async () => {
    const answer = await inquirer.prompt(addDepartment);
    db.query(
      `INSERT INTO department (name)
      VALUES ('${answer.addName}');
      `,
      (req, res) => {
        console.log(`Added ${answer.addName} to the database`);
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

// let roleChoices = async () =>
//   db.query("SELECT department.id FROM department;", (req, res) => {
//     const entries = Object.keys(res);
//     console.log(entries);
//   });
