'use strict';

// NOTE: Don't change the port number
const PORT = 3000;

// The variable stocks has the same value as the variable stocks in the file `stocks.js`
// const hikes = require('./hikes.js').hikes;

const express = require("express");
const app = express();


app.use(express.urlencoded({
    extended: true
    
}));
app.post("/hlist", (req, res) => {
    console.log(req.body);
    const hi = req.body.hike;
    res.send(`The weather in zip code ${hi} is Sunny with a high of 75 F and 0 % chance of rain.`);
});


app.use(express.static('public'));
// Add your code here

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});