const mysql = require("mysql");
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
                "Add Department"
            ]
        }
    ])
    .then((answers) => {
        
    })
}
