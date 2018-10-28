# bamazon


## About Bamazon

Bamazon is an Amazon-like storefront. The app takes in orders from customers and depletes stock from the store's inventory. You can program your app to track product sales across your store's departments and then provide a summary of the highest-grossing departments in the store.


- - -

## What it does

Bamazon has 3 different Views:
Customer View
Manager View
Supervisor View

- - -

### Prerequisites
[ node.js ](https://nodejs.org/en/)

### How it works

Enter one of the following in the Command line:

   1.  Customer View 
   `node bamazonCustomer.js`

     The app will prompt users with two messages.

   * The first  will ask them the ID of the product they would like to buy.
   * The second message will ask how many units of the product they would like to buy.

  * Once the customer has placed the order, the application checks if the store has enough of the product to meet the customer's request.

   * If not, the app will log the phrase `Insufficient quantity!`, and then prevent the order from going through.

 * However, if the store _does_ have enough of the product, the order will be fulfilled.
   * The SQL database will be updated to reflect the remaining quantity.
   * Once the update goes through, the console will print the total cost of the purchase.


   2. Manager View  `node bamazonManager.js`
     * Running this application will:

     * List a set of menu options:

        * View Products for Sale
        
        * View Low Inventory
        
        * Add to Inventory
        
        * Add New Product

  * If you (the manager) selects `View Products for Sale`, the app will list every available item: the item IDs, names, prices, and quantities.

  * If the manager selects `View Low Inventory`, then it will list all items with an inventory count lower than five.

  * If the manager selects `Add to Inventory`, the app will display a prompt that will let the manager "add more" of any item currently in the store.

  * If the manager selects `Add New Product`, it will allow the manager to add a completely new product to the store.


   3. Supervisor View Part 1 `bamazonCustomer.js` 

     Additional functionality has been added to item #1 (Bamazon Customer) so that  when a customer purchases anything from the store, the price of the product multiplied by the quantity purchased is added to the product's product_sales column.

   * The app still updates the inventory listed in the `products` column.

   3. Supervisor View Part 2
   `bamazonSupervisor.js`
   Running this application will list a set of menu options:

   * View Product Sales by Department
   
   * Create New Department

* When you (the supervisor) selects `View Product Sales by Department`, the app will display a summarized table in their terminal/bash window that looks like this:
 
 department_id | department_name | over_head_costs | product_sales | total_profit |
| ------------- | --------------- | --------------- | ------------- | ------------ |
| 01            | Electronics     | 10000           | 20000         | 10000        |
| 02            | Clothing        | 60000           | 100000        | 40000        |

* The `total_profit` column is calculated on the fly using the difference between `over_head_costs` and `product_sales`. `total_profit` is not stored in any database. 



- - -



