# Bamazon
An Amazon-like storefront node app incorporating MySQL

## Table of Contents

- [Customer Mode](#customer-mode)
- [Manager Mode](#manager-mode)
- [Supervisor Mode](#supervisor-mode)
- [Dependencies](#dependencies)
- [Next Steps](#next-steps)

## Customer Mode
Using bamazonCustomer.js as an entry point, the customer can purchase items through Bamazon. The products and departments tables are updated when the customer makes a purchase.


[![Customer Mode](https://img.youtube.com/vi/wqOqWiSyVKs/0.jpg)](https://www.youtube.com/watch?v=wqOqWiSyVKs)

## Manager Mode
The manager is able to view products for sale, view low inventory, add to inventory, and add new products. This mode is accessed through bamazonManager.js.


[![Manager Mode](https://img.youtube.com/vi/BqmgJskm_Ts/0.jpg)](https://www.youtube.com/watch?v=BqmgJskm_Ts)

## Supervisor Mode
The supervisor can view a table of product sales by department or add a new department. A new column, Total Profit, is created on the fly using an alias.


[![Supervisor Mode](https://img.youtube.com/vi/UbZ6Nfnbh5w/0.jpg)](https://www.youtube.com/watch?v=UbZ6Nfnbh5w)


## Dependencies
This app uses inquirer.js, mysql, and cli-table. I used mySQL Workbench during development.

## Next Steps
This is my first experience using a relational database in an application.  SQL seemed straightforward at the outset but quickly became more challenging as the project requirements called for more complicated queries. I'm more aware than ever that I've only scratched the surface, and I hope to become more proficient as future projects push me into greater depth.  It would be fun to design a browser-based front end for this app.