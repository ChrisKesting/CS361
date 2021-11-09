'use strict';

// NOTE: Don't change the port number
const PORT = 3000;

//const { Router } = require("express");
// The variable hikes has the same value as the variable hikes in the file `hikes.js`
// const hikes = require('./hikes.js').hikes;

const express = require("express");
const superagent = require('superagent');
const app = express();
app.use(express.static('public'));
app.use(express.json())
app.use(express.urlencoded({
    extended: true
    
}));
app.post("/hlist", (req, res) => {
    console.log(req.body);
    const zip = req.body.hike;
    console.log(zip)

    superagent
    .post("http://localhost:3030/current-weather/zip-code/")
    .set('Content-Type', 'application/json')
    .send({zipCode: zip})
    .end((err, result) => {
        var body = result.body
        var weather = body.weather
        var temp = body.temperature
        var city = body.cityName
        console.log(result.body)
        res.send(`The weather in zip code ${zip} with closest city, ${city}, is ${weather} with a high of ${temp} F.`);
    })
 
    
    
})

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});