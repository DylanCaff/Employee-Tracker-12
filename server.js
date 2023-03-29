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
                "Update Employee Role",
                "View All Roles",
                "Add Role",
                "View All Departments",
                "Add Department",
                "Update Employee Managers",
                "View Employees by Manager",
                "View Employees by Department",
                "Delete Departments, Roles, or Employees",
                "View Department Budgets",
                "Quit",
            ]
        }
    ])
        .then((answers) => {
            const { choice } = answers;

            if (choice === "View All Employees") {
                showEmployees();
            }

            if (choice === "Add Employee") {
                addEmployee();
            }

            if (choice === "Update Employee Role") {
                updateEmployee();
            }

            if (choice === "View All Roles") {
                showRoles();
            }

            if (choice === "Add Role") {
                addRole();
            }

            if (choice === "View All Departments") {
                showDepartments();
            }

            if (choice === "Add Department") {
                addDepartment();
            }

            if (choice === "Update Employee Managers") {
                updateManager();
            }

            if (choice === "Delete Departments, Roles, or Employees") {
                deleteUserInput();
            }

            if (choice === "View Employees by Manager") {
                viewEmployeeByManager();
            }

            if (choice === "View Employees by Department") {
                viewEmployeeByDepartment();
            }

            if (choice === "View Department Budgets") {
                viewBudget();
            }

            if (choice === "Quit") {
                connection.end()
            }
        });
};

showEmployees = () => {
    console.log('Showing all Employees...\n');
    const sql = `SELECT employee.id, 
    employee.first_name, 
    employee.last_name, 
    role.title, 
    department.name AS department,
    role.salary, 
    CONCAT (manager.first_name, " ", manager.last_name) AS manager
FROM employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee manager ON employee.manager_id = manager.id`;

    connection.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        promptUser();
    });
}

showDepartments = () => {
    console.log('Showing all departments...\n');
    const sql = `SELECT department.id AS id, department.name AS name FROM department`;

    connection.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        promptUser();
    });
};

const addEmployee = () => {
    inquirer
      .prompt([
        {
          type: "input",
          name: "firstName",
          message: "What is the employee's first name?",
          validate: (addFirst) => {
            if (addFirst) {
              return true;
            } else {
              console.log("Please enter a first name");
              return false;
            }
          },
        },
        {
          type: "input",
          name: "lastName",
          message: "What is the employee's last name?",
          validate: (addLast) => {
            if (addLast) {
              return true;
            } else {
              console.log("Please enter a last name");
              return false;
            }
          },
        },
      ])
      .then((answer) => {
        const params = [answer.firstName, answer.lastName];
  
        const roleSql = `SELECT role.id, role.title FROM role`;
  
        connection.query(roleSql, (err, data) => {
          if (err) throw err;
  
          const roles = data.map(({ id, title }) => ({ name: title, value: id }));
  
          inquirer
            .prompt([
              {
                type: "list",
                name: "role",
                message: "What is the employee's role?",
                choices: roles,
              },
            ])
            .then((roleChoice) => {
              const role = roleChoice.role;
              params.push(role);
  
              const managerSql = `SELECT * FROM employee`;
  
              connection.query(managerSql, (err, data) => {
                if (err) throw err;
  
                const managers = data.map(
                  ({ id, first_name, last_name }) =>
                    ({ name: first_name + " " + last_name, value: id })
                );
  
                inquirer
                  .prompt([
                    {
                      type: "list",
                      name: "manager",
                      message: "Who is the employee's manager?",
                      choices: managers,
                    },
                  ])
                  .then((managerChoice) => {
                    const manager = managerChoice.manager;
                    params.push(manager);
  
                    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                          VALUES (?, ?, ?, ?)`;
  
                    connection.query(sql, params, (err, result) => {
                      if (err) throw err;
                      console.log("Employee has been added!");
  
                      showEmployees();
                    });
                  });
              });         });
        });
      });
  };

  updateEmployee = () => {

    const employeeSql = `SELECT * FROM employee`;

    connection.query(employeeSql, (err, data) => {
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
                const employeeId = empChoice.name;
                const params = [];
                params.push(employeeId);

                const roleSql = `SELECT * FROM role`;

                connection.query(roleSql, (err, data) => {
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
                            const roleId = roleChoice.role;
                            params.push(roleId);

                            const sql = `UPDATE employee SET role = ? WHERE id = ?`;

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

    const sql = `SELECT role.id, role.title, role.salary, department.name AS department
    FROM role
    INNER JOIN department ON role.department_id = department.id;
    
    `;

    connection.query(sql, (err, rows) => {
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

    connection.query(employeeSql, (err, data) => {
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

                connection.query(managerSql, (err, data) => {
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

    connection.query(deptSql, (err, data) => {
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

    connection.query(roleSql, (err, data) => {
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

    connection.query(employeeSql, (err, data) => {
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

    connection.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);

        promptUser();
    });
};
