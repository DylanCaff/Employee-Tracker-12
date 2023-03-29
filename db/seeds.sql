INSERT INTO department (id, name)
VALUES (1, "Engineering2"),
       (2, "Finance2"),
       (3, "Legal2"),
       (4, "Sales2");

INSERT INTO role (department_id, title, salary)
VALUES (1, "Sales Lead", 100000),
       (2, "Salesperson", 80000),
       (3, "Lead Engineer", 150000),
       (4, "Software Engineer", 120000),
       (1, "Account Manager", 160000),
       (2, "Accountant", 125000),
       (3, "Legal Team Lead", 250000),
       (4, "Lawyer", 190000);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("John", "Doe", 1),
       ("Mike", "Chan", 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Mike", "Chan", 2, 1),
       ("Ashley", "Rogriguez", 3, 1),
       ("Kevin", "Tupik", 4, 1),
       ("Kunal", "Singh", 5, 2),
       ("Malia", "Brown", 6, 2),
       ("Sarah", "Lourd", 7, 2),
       ("Tom", "Allen", 8, 2);