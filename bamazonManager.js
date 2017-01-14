var mysql = require("mysql");
var inquirer = require("inquirer");
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
    console.log('Welcome to Bamazon!');
    managerTasks();
});

function managerTasks() {

    inquirer.prompt([{

            type: 'list',
            name: 'tasks',
            message: 'What would you like to do?',
            choices: ['view-products-for-sale', 'view-low-inventory', 'add-to-inventory', 'add-new-product', 'quit']
        }

    ]).then(function(choice) {

        if (choice.tasks === 'view-products-for-sale') {
            viewProducts();

        } else if (choice.tasks === 'view-low-inventory') {
            viewLowInventory();
        } else if (choice.tasks === 'add-to-inventory') {
            addToInventory();
        } else if (choice.tasks === 'add-new-product') {
            addNewProduct();
        } else {

            connection.end(function(err) {
                // The connection is terminated gracefully
            });

        }
    });
}
//Displays current products in store
function viewProducts() {
    connection.query("SELECT * FROM products", function(err, res) {
        console.log('\n');
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + '. ' + res[i].product_name + ' | ' + res[i].department_name + ' | ' + '$' +
                res[i].price.toFixed(2) + ' | ' + res[i].stock_quantity);
            console.log('----------------------------------------------------------');
        }
        managerTasks();
    });

};
//Checks for products with fewer than five units in stock
function viewLowInventory() {

    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, res) {
        console.log('\n');
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + '. ' + res[i].product_name + ' | ' + res[i].department_name + ' | ' + '$' +
                res[i].price.toFixed(2) + ' | ' + res[i].stock_quantity);
            console.log('----------------------------------------------------------');
        }
        managerTasks();
    })

};
//Allows manager to add more units to inventory
var addToInventory = function() {
    connection.query("SELECT product_name,stock_quantity FROM products", function(err, res) {

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
            message: "Which product would you like to restock?"
        }).then(function(answer) {
            for (var i = 0; i < res.length; i++) {

                if (res[i].product_name === answer.products) {
                    var chosenItem = res[i];
                    inquirer.prompt({
                        name: "quantity",
                        type: "input",
                        message: "You currently have " + chosenItem.stock_quantity + " of that item. How many units would you like to add?"
                    }).then(function(ans) {

                        var total = chosenItem.stock_quantity + parseInt(ans.quantity);
                        connection.query("UPDATE products SET ? WHERE ?", [{
                            stock_quantity: total
                        }, {
                            product_name: chosenItem.product_name
                        }], function(err, res) {
                            if (err) {
                                throw err;
                            } else {
                                const maybePluralize = (count, noun, suffix = 's') =>
                                    `${count} ${noun}${count !== 1 && noun.charAt(noun.length-1)!== 's'? suffix : ''}`;
                                console.log("You now have " + maybePluralize(total, chosenItem.product_name) + ' in stock.');

                                managerTasks();
                            }
                        });

                    })
                }

            }
        })
    })
}

//Allows manager to add a new product
function addNewProduct() {
    inquirer.prompt([{
        name: "product",
        type: "input",
        message: "What product would you like to add?"
    }, {
        name: "department",
        type: "input",
        message: "In which department does the item belong?"
    }, {
        name: "price",
        type: "input",
        message: "What is the price per unit?",
        validate: function(value) {
            if (isNaN(value) === false && value.length > 0) {
                return true;
            }
            return false;
        }
    }, {
        name: "quantity",
        type: "input",
        message: "How many units would you like to add?",
        validate: function(value) {
            if (isNaN(value) === false && value.length > 0) {
                return true;
            }
            return false;
        }

    }]).then(function(answer) {
        connection.query("INSERT INTO products SET ?", {
            product_name: answer.product,
            department_name: answer.department,
            price: answer.price,
            stock_quantity: answer.quantity
        }, function(err, res) {
            if (err) {
                throw err;
            }
            console.log("Your product was added successfully!");
            managerTasks();
        });
    });

};
