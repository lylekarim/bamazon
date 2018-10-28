var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
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

// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    // run the after conection function after the connection is made to show table contents
    start();
});

// function which prompts the user for what action they should take
function start() {
  inquirer
    .prompt({
      name: "shopOrQuit",
      type: "rawlist",
      message: "Would you like to [keep shopping] or [quit]?",
      choices: ["SHOP", "QUIT"]
    })
    .then(function(answer) {
      // based on their answer, either call the bid or the post functions
      if (answer.shopOrQuit.toUpperCase() === "SHOP") {
        productSearch();
      }
      else {
        quitShopping();
      }
    });
}

function quitShopping() {
    console.log("Goodbye...\n");
        connection.end();
      }


// function which prompts the user for what id
function productSearch() {
    // query the database for all items in product table
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        // once you have the items, prompt the user for which they'd like to bid on
        inquirer
            .prompt([
                {
                    name: "choice",
                    type: "rawlist",
                    pageSize: "20",
                    choices: function () {
                        var choiceArray = [];
                        for (var i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].product_name);
                        }
                        return choiceArray;
                    },
                    message: "What product ID do you want to see?"
                },
                {
                    name: "units",
                    type: "input",
                    message: "How many units would you like to buy?"
                }
            ])
            .then(function (answer) {
                // get the information of the chosen item
                var chosenItem;
                for (var i = 0; i < results.length; i++) {
                    if (results[i].product_name === answer.choice) {
                        chosenItem = results[i];
                    }
                }
                var updatedStock;
                var productSales;
                // determine if bid was high enough
                if (chosenItem.stock_quantity >= parseInt(answer.units)) {
                    // bid was high enough, so update db, let the user know, and start over
                    updatedStock = chosenItem.stock_quantity - answer.units;
                   
                    productSales = chosenItem.product_sales + (chosenItem.price * (answer.units));

                    connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                            {
                                stock_quantity: updatedStock
                            },
                            {
                                id: chosenItem.id
                            }
                        ],
                        function (error) {
                            if (error) throw err;
                            console.log("Order placed successfully!");
                            console.log("You ordered " + answer.units + " " + chosenItem.product_name + " for $" + (chosenItem.price * (answer.units)))
                             start();
                        }
                    );
                    connection.query('UPDATE products SET ? WHERE ?',
                    [
                        {
                            product_sales: productSales
                        },
                        {
                            id: chosenItem.id
                        }
                    ], function (error, results, fields) {
                       
                      });
                }
                else {
                    // bid wasn't high enough, so apologize and start over
                    console.log("Insufficient stock. Try again...");
                    start();
                }
            });
    });
}