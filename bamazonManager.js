var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    runSearch();
});

function runSearch() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product",
                "Quit this App Forever"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {

                case "View Products for Sale":
                    productSearch();
                    break;

                case "View Low Inventory":
                    lowInventorySearch();
                    break;

                case "Add to Inventory":
                    addInventory();
                    break;

                case "Add New Product":
                    addProduct();
                    break;

                case "Quit this App Forever":
                    quitApp();
                    break;


            }
        });
}

function productSearch() {
    connection.query("SELECT * FROM products", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
        }
        console.log("-----------------------------------");
        runSearch();
    });
}

function lowInventorySearch() {
    var query = "SELECT * FROM products WHERE stock_quantity > 5";
    connection.query(query, function (err, res) {

        for (var i = 0; i < res.length; i++) {

            console.log(res[i].product_name +
                " | " + res[i].stock_quantity + " items remaining");

        }
        runSearch();
    });
}


function addInventory() {
    console.log("Updating all quantities...\n");
    var query = connection.query(
        "UPDATE products SET ? ",
        [
            {
                stock_quantity: 100
            },

        ],
        function (err, res) {
            console.log(res.affectedRows + " products updated!\n");
            // Call search menu
            runSearch();
        }
    );

}

function addProduct() {
    // prompt for info about the item being put up for auction
    inquirer
        .prompt([
            {
                name: "product",
                type: "input",
                message: "What is the item you would like to submit?"
            },
            {
                name: "category",
                type: "input",
                message: "What category would you like to put your product in?"
            },
            {
                name: "price",
                type: "input",
                message: "How much does this product cost?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "units",
                type: "input",
                message: "How many units are there of this product?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then(function (answer) {
            // when finished prompting, insert a new item into the db with that info
            connection.query(
                "INSERT INTO products SET ?",
                {
                    product_name: answer.product,
                    department_name: answer.category,
                    price: answer.price,
                    stock_quantity: answer.units
                },
                function (err) {
                    if (err) throw err;
                    console.log("Your product was added successfully!");
                    // re-prompt the user for if they want to bid or post
                    runSearch();
                }
            );
        });
}

function quitApp() {
    console.log("Goodbye...\n");
    connection.end();
}
