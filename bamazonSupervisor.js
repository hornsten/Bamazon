var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "seville",
    database: "Bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    taskChoice();
});

function taskChoice() {
    inquirer.prompt([{

            type: 'list',
            name: 'task',
            message: 'What would you like to do?',
            choices: ['view-product-sales-by-department', 'create-new-department', 'quit']
        }

    ]).then(function(choice) {

        if (choice.task === 'view-product-sales-by-department') {
            viewProductSales();

        } else if (choice.task === 'create-new-department') {
            createNewDepartment();

        } else {
            console.log('Session ended');
            connection.end(function(err) {
                // The connection is terminated gracefully

            });

        }
    });
}

function viewProductSales() {
    connection.query("SELECT total_sales - over_head_costs AS total_profit,department_id,department_name,over_head_costs,total_sales FROM departments", function(err, res) {

        // instantiate 
        var table = new Table({
            head: ['ID', 'department_name', 'over_head_costs', 'total_sales', 'total_profit'],
            colWidths: [5, 20, 20, 20, 20]
        });

        for (var i = 0; i < res.length; i++) {
            // table is an Array, so you can `push`, `unshift`, `splice` and friends 
            table.push(
                [res[i].department_id, res[i].department_name, res[i].over_head_costs, res[i].total_sales, res[i].total_profit]
            );
        }
        console.log(table.toString());
        taskChoice();
    });
}

function createNewDepartment() {
    inquirer.prompt([{
        name: "department",
        type: "input",
        message: "What is the department name?"
    }, {

        name: "costs",
        type: "input",
        message: "What are the overhead costs?",
        validate: function(value) {
            if (isNaN(value) === false) {
                return true;
            }
            return false;
        }

    }]).then(function(answer) {
        connection.query("INSERT INTO departments SET ?", {
            department_name: answer.department,
            over_head_costs: answer.costs
        }, function(err, res) {
            if (err) throw err;
            console.log("The department was added successfully.");
            taskChoice();
        });
    });

};
