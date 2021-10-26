'use strict';

// NOTE: Don't change the port number
const PORT = 3000;

// The variable stocks has the same value as the variable stocks in the file `stocks.js`
const stocks = require('./stocks.js').stocks;

const express = require("express");
const app = express();


app.use(express.urlencoded({
    extended: true
    
}));
app.post("/slist", (req, res) => {
    console.log(req.body);
    const co = req.body.company;
    const sh = req.body.shares;
    const myco = stocks.find(company => company.company === co);
    const pr = myco.price
    const tot = sh * pr
    res.send(`You placed an order to buy ${sh} shares of ${co}. The price of one stock is ${pr} , and the total for your order is ${tot}.`);
});
app.post("/ssearch", (req, res) => {
    console.log(req.body);
    const cr = req.body.criteria;
    
    function findStockByPrice (string) {
        let maxi = stocks[0].price;
        let mini = stocks[0].price;
        stocks.forEach((element) => {
            if (element.price > maxi){
                maxi = element.price;
            }
            if (element.price < mini){
                mini = element.price;
            }
        })
        let result = stocks[0]
        if (string === 'maximum'){
            result = stocks.find(element => element.price === maxi);
        } else if (string === 'minimum'){
            result = stocks.find(element => element.price === mini);
        }
        return result
    }

    const stobj = findStockByPrice(cr);
    res.send(stobj);
});
app.use(express.static('public'));
// Add your code here

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});