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
                "Update employee managers",
                "View employees by manager",
                "View employees by department",
                "Delete departments, roles, or employees",
                "View department budgets",
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

            if (choices === "Update an employee manager") {
                updateManager();
            }

            if (choices === "Delete a department") {
                deleteDepartment();
            }

            if (choices === "Delete a role") {
                deleteRole();
            }

            if (choices === "Delete an employee") {
                deleteEmployee();
            }

            if (choices === "View department budgets") {
                viewBudget();
            }

            if (choices === "Quit") {
                connection.end()
            }
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

addEmployee = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'fistName',
            message: "What is the employee's first name?",
            validate: addFirst => {
                if (addFirst) {
                    return true;
                } else {
                    console.log('Please enter a first name');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'lastName',
            message: "What is the employee's last name?",
            validate: addLast => {
                if (addLast) {
                    return true;
                } else {
                    console.log('Please enter a last name');
                    return false;
                }
            }
        }
    ])
        .then(answer => {
            const params = [answer.fistName, answer.lastName]

            const roleSql = `SELECT role.id, role.title FROM role`;

            connection.promise().query(roleSql, (err, data) => {
                if (err) throw err;

                const roles = data.map(({ id, title }) => ({ name: title, value: id }));

                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'role',
                        message: "What is the employee's role?",
                        choices: roles
                    }
                ])
                    .then(roleChoice => {
                        const role = roleChoice.role;
                        params.push(role);

                        const managerSql = `SELECT * FROM employee`;

                        connection.promise().query(managerSql, (err, data) => {
                            if (err) throw err;

                            const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));


                            inquirer.prompt([
                                {
                                    type: 'list',
                                    name: 'manager',
                                    message: "Who is the employee's manager?",
                                    choices: managers
                                }
                            ])
                                .then(managerChoice => {
                                    const manager = managerChoice.manager;
                                    params.push(manager);

                                    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                        VALUES (?, ?, ?, ?)`;

                                    connection.query(sql, params, (err, result) => {
                                        if (err) throw err;
                                        console.log("Employee has been added!")

                                        showEmployees();
                                    });
                                });
                        });
                    });
            });
        });
};

updateEmployee = () => {
    // get employees from employee table 
    const employeeSql = `SELECT * FROM employee`;

    connection.promise().query(employeeSql, (err, data) => {
        if (err) throw err;

        const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'name',
                message: "Which employee would you like to update?",
                choices: employees
            }
        ])
            .then(empChoice => {
                const employee = empChoice.name;
                const params = [];
                params.push(employee);

                const roleSql = `SELECT * FROM role`;

                connection.promise().query(roleSql, (err, data) => {
                    if (err) throw err;

                    const roles = data.map(({ id, title }) => ({ name: title, value: id }));

                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'role',
                            message: "What is the employee's new role?",
                            choices: roles
                        }
                    ])
                        .then(roleChoice => {
                            const role = roleChoice.role;
                            params.push(role);

                            let employee = params[0]
                            params[0] = role
                            params[1] = employee


                            const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;

                            connection.query(sql, params, (err, result) => {
                                if (err) throw err;
                                console.log("Employee has been updated!");

                                showEmployees();
                            });
                        });
                });
            });
    });
};

showRoles = () => {
    console.log('Showing all roles...\n');

    const sql = `SELECT role.id, role.title, department.salary AS department
            FROM role
            INNER JOIN department ON role.department_id = department.id`;

    connection.promise().query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        promptUser();
    })
};


addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'addDept',
            message: "What department do you want to add?",
            validate: addDept => {
                if (addDept) {
                    return true;
                } else {
                    console.log('Please enter a department');
                    return false;
                }
            }
        }
    ])
        .then(answer => {
            const sql = `INSERT INTO department (name)
                      VALUES (?)`;
            connection.query(sql, answer.addDept, (err, result) => {
                if (err) throw err;
                console.log('Added ' + answer.addDept + " to departments!");

                showDepartments();
            });
        });
};

updateManager = () => {
    const employeeSql = `SELECT * FROM employee`;

    connection.promise().query(employeeSql, (err, data) => {
        if (err) throw err;

        const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'name',
                message: "Which employee would you like to update?",
                choices: employees
            }
        ])
            .then(empChoice => {
                const employee = empChoice.name;
                const params = [];
                params.push(employee);

                const managerSql = `SELECT * FROM employee`;

                connection.promise().query(managerSql, (err, data) => {
                    if (err) throw err;

                    const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'manager',
                            message: "Who is the employee's manager?",
                            choices: managers
                        }
                    ])
                        .then(managerChoice => {
                            const manager = managerChoice.manager;
                            params.push(manager);

                            let employee = params[0]
                            params[0] = manager
                            params[1] = employee

                            const sql = `UPDATE employee SET manager_id = ? WHERE id = ?`;

                            connection.query(sql, params, (err, result) => {
                                if (err) throw err;
                                console.log("Employee has been updated!");

                                showEmployees();
                            });
                        });
                });
            });
    });
};

deleteDepartment = () => {
    const deptSql = `SELECT * FROM department`;

    connection.promise().query(deptSql, (err, data) => {
        if (err) throw err;

        const dept = data.map(({ name, id }) => ({ name: name, value: id }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'dept',
                message: "What department do you want to delete?",
                choices: dept
            }
        ])
            .then(deptChoice => {
                const dept = deptChoice.dept;
                const sql = `DELETE FROM department WHERE id = ?`;

                connection.query(sql, dept, (err, result) => {
                    if (err) throw err;
                    console.log("Successfully deleted!");

                    showDepartments();
                });
            });
    });
};

deleteRole = () => {
    const roleSql = `SELECT * FROM role`;

    connection.promise().query(roleSql, (err, data) => {
        if (err) throw err;

        const role = data.map(({ title, id }) => ({ name: title, value: id }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'role',
                message: "What role do you want to delete?",
                choices: role
            }
        ])
            .then(roleChoice => {
                const role = roleChoice.role;
                const sql = `DELETE FROM role WHERE id = ?`;

                connection.query(sql, role, (err, result) => {
                    if (err) throw err;
                    console.log("Successfully deleted!");

                    showRoles();
                });
            });
    });
};

deleteEmployee = () => {
    const employeeSql = `SELECT * FROM employee`;

    connection.promise().query(employeeSql, (err, data) => {
        if (err) throw err;

        const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'name',
                message: "Which employee would you like to delete?",
                choices: employees
            }
        ])
            .then(empChoice => {
                const employee = empChoice.name;

                const sql = `DELETE FROM employee WHERE id = ?`;

                connection.query(sql, employee, (err, result) => {
                    if (err) throw err;
                    console.log("Successfully Deleted!");

                    showEmployees();
                });
            });
    });
};

viewBudget = () => {
    console.log('Showing budget by department...\n');

    const sql = `SELECT department_id AS id, 
                        department.name AS department,
                        SUM(salary) AS budget
                 FROM  role  
                 JOIN department ON role.department_id = department.id GROUP BY  department_id`;

    connection.promise().query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);

        promptUser();
    });
};
