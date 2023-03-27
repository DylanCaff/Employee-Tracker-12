INSERT INTO department (id, name)
VALUES (1, "Engineering"),
       (2, "Finance"),
       (3, "Legal"),
       (4, "Sales");

INSERT INTO role (department_id, title, salary)
VALUES (1, "Sales Lead", 100000),
       (2, "Salesperson", 80000),
       (3, "Lead Engineer", 150000),
       (4, "Software Engineer", 120000),
       (5, "Account Manager", 160000),
       (6, "Accountant", 125000),
       (7, "Legal Team Lead", 250000),
       (8, "Lawyer", 190000);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Doe", 1, 4),
       ("Mike", "Chan", 2, 4),
       ("Ashley", "Rogriguez", 3, 1),
       ("Kevin", "Tupik", 4, 1),
       ("Kunal", "Singh", 5, 2),
       ("Malia", "Brown", 6, 2),
       ("Sarah", "Lourd", 7, 3),
       ("Tom", "Allen", 8, 3);

