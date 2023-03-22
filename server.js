const mysql = require("mysql2");
const inquirer = require("inquirer");
const cTable = require('console.table');
require('dotenv').config();

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.password,
    database: 'employee_db'
});

connection.connect(function (err) {
    if (err) throw err
    console.log("Connected as Id" + connection.threadId)
    console.log(`
    ===============================================
    |                                             |
    |                                             |
    |                                             |
    |             Employee Manager                |
    |                                             |
    |                                             |
    |                                             |
    ===============================================
    `)
    promptUser();
});


function promptUser() {
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            name: "choice",
            choices: [
                "View All Employees",
                "Add Employee",
                "Update Employee role",
                "View All Roles",
                "Add Role",
                "View all Deparments",
                "Add Department",
                "Quit",
            ]
        }
    ])
        .then((answers) => {
            const { choice } = answers;

            if (choice === "View All Employees") {
                showDepartments();
            }

            if (choices === "Add Employee") {
                addEmployee();
            }

            if (choices === "Update Employee Role") {
                updateEmployee();
            }

            if (choices === "View All Roles") {
                showRoles();
            }

            if (choices === "Add Role") {
                addRole();
            }

            if (choices === "View All Departments") {
                showDepartments();
            }

            if (choices === "Add a department") {
                addDepartment();
            }

            if (choices === "No Action") {
                connection.end()
            };
        });
};

showDepartments = () => {
    console.log('Showing all departments...\n');
    const sql = `SELECT department.id AS id, department.name AS department FROM department`; 
  
    connection.promise().query(sql, (err, rows) => {
      if (err) throw err;
      console.table(rows);
      promptUser();
    });
  };
