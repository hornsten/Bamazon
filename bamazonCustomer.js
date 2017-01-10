var mysql = require("mysql");
var inquirer = require("inquirer");

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
    console.log('Welcome to Bamazon!');
    buyStuff();
});

var buyStuff = function() {
    connection.query("SELECT * FROM products", function(err, res) {

        inquirer.prompt({
            name: "products",
            type: "rawlist",
            choices: function(value) {
                var productsArray = [];
                for (var i = 0; i < res.length; i++) {
                    productsArray.push(res[i].product_name);
                }
                return productsArray;
            },
            message: "What is the ID of the product you would like to buy?"
        }).then(function(answer) {
            for (var i = 0; i < res.length; i++) {

                if (res[i].product_name === answer.products) {
                    var chosenItem = res[i];
                    inquirer.prompt({
                        name: "quantity",
                        type: "input",
                        message: "How many units would you like to buy?"
                    }).then(function(answer) {

                        if (chosenItem.stock_quantity < parseInt(answer.quantity)) {
                            console.log("Sorry, we only have " + chosenItem.stock_quantity + " of those in stock.");
                            buyStuff();

                        } else {
                            var total = chosenItem.price * parseInt(answer.quantity);

                            connection.query("UPDATE products SET ? WHERE ?", [{
                                stock_quantity: chosenItem.stock_quantity - parseInt(answer.quantity),
                                product_sales: chosenItem.product_sales + total
                            }, {
                                item_id: chosenItem.item_id
                            }], function(err, res) {

                                const maybePluralize = (count, noun, suffix = 's') =>
                                    `${count} ${noun}${count !== 1 && noun.charAt(noun.length-1)!== 's'? suffix : ''}`;
                                console.log("You have bought " + maybePluralize(parseInt(answer.quantity), chosenItem.product_name));
                                console.log("Your total is $" + total);

                            });

                            connection.query("UPDATE departments SET departments.total_sales = (SELECT SUM(products.product_sales) FROM products WHERE departments.department_name=products.department_name)",
                                function(err, res) {
                                    if (err) {
                                        throw err;
                                    }
                                    console.log(res);
                                });
                            taskChoice();
                        }
                    })
                }

            }
        })
    })
}

function taskChoice() {
    inquirer.prompt([{

            type: 'list',
            name: 'task',
            message: 'What would you like to do?',
            choices: ['buy-stuff', 'quit']
        }

    ]).then(function(choice) {

        if (choice.task === 'buy-stuff') {
            buyStuff();

        } else {
            console.log('Thank you for shopping at Bamazon, and have a super day!');
            connection.end(function(err) {
                // The connection is terminated gracefully

            });

        }
    });
}
