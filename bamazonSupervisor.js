var mysql = require("mysql");
var inquirer = require("inquirer");
var cTable = require('console.table');
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
                "View Product Sales by department",
                "Create New Department",
                "Quit this App Forever"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {

                case "View Product Sales by department":
                    productSalesSearch();
                    break;

                case "Create New Department":
                    createDepartment();
                    break;

                case "Quit this App Forever":
                    quitApp();
                    break;
            }
        });
}

function productSalesSearch() {
    var query = "SELECT p.product_sales,department_id,department_name,over_head_costs,";
   query += "department.stock_quantity FROM products p INNER JOIN department USING"; query += "(department_name)";

    connection.query(query, function (err, res) {
        if (err) throw err;
      // console.log(res);
     
      console.log("department_id" + " | " + "department_name" + " | " + "over_head_costs" + " | " + "product_sales" + " | " + "stock_quanity" + " | " +"Total Profit");
    
        for (var i = 0; i < res.length; i++) {

      var totalProfit = (res[i].over_head_costs - res[i].product_sales);
     // console.log(totalProfit);
     
            console.log(res[i].department_id + "             | " + res[i].department_name + "        | " + res[i].over_head_costs + "             | " + res[i].product_sales + "             | " + res[i].stock_quantity + "             | " + totalProfit);

        }
        console.log("-----------------------------------");
        runSearch();
    });
}

function createDepartment() {
    // prompt for info about the item being put up for auction
    inquirer
        .prompt([
            {
                name: "department_name",
                type: "input",
                message: "What is the department you would like to add?"
            },
            {
                name: "overhead",
                type: "input",
                message: "What are the overhead costs for this department?"
            },
            {
                name: "units",
                type: "input",
                message: "number of stock in this department",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
    
        ])
        .then(function (answer) {
            // when finished prompting, insert a new item into the db with that info
            connection.query(
                "INSERT INTO department SET ?",
                {
                    department_name: answer.department_name,
                    over_head_costs: answer.overhead,
                    stock_quantity: answer.units,
                   
                },
                function (err) {
                    if (err) throw err;
                    console.log("Your department was added successfully!");
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
