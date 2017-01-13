var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');
var password = require("./password");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: password,
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
    //Using an alias, this query creates a new column on the fly to reflect the actual total profits of Bamazon by department (total sales - overhead costs)
    connection.query("SELECT total_sales - over_head_costs AS total_profit,department_id,department_name,over_head_costs,total_sales FROM departments", function(err, res) {

        // instantiates the table object
        var table = new Table({
            head: ['ID', 'department_name', 'over_head_costs', 'total_sales', 'total_profit'],
            colWidths: [5, 20, 20, 20, 20]
        });

        for (var i = 0; i < res.length; i++) {
            // pushes the query results into the table
            table.push(
                [res[i].department_id, res[i].department_name, res[i].over_head_costs, res[i].total_sales, res[i].total_profit]
            );
        }
        console.log(table.toString());
        taskChoice();
    });
}
//allows Supervisor to create a new department. In the schema, default value for total sales is set to zero
function createNewDepartment() {
    inquirer.prompt([{
        name: "department",
        type: "input",
        message: "What is the department name?",
        validate: function(value) {
            if (value.length > 0) {
                return true;
            }
            return false;
        }
    }, {

        name: "costs",
        type: "input",
        message: "What are the overhead costs?",
        validate: function(value) {
            if (isNaN(value) === false && value !== 0 && value.length > 0) {
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
